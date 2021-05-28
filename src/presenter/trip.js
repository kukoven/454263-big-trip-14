import NoPointView from '../view/no-point.js';
import SortView from '../view/sort.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {render, RenderPosition, remove} from '../util/render.js';
import PointPresenter from './point.js';
import {sortDay, sortTime, sortPrice} from '../util/point.js';
import SiteMenuView from '../view/site-menu.js';
import FiltersView from '../view/filters.js';
import NewPointPresenter from './new-point.js';
import TripInformationPresenter from './trip-information.js';
import {filter} from '../util/filter.js';

class Trip {
  constructor(tripMainElement, pageMainElement, pointsModel, filterModel) {

    this._tripMainElement = tripMainElement;
    this._siteMenuElement = this._tripMainElement.querySelector('.trip-controls__navigation');
    this._filtersElement = this._tripMainElement.querySelector('.trip-controls__filters');

    this._pageMainElement = pageMainElement;
    this._tripEventsElement = this._pageMainElement.querySelector('.trip-events');
    this._eventsListElement = this._tripEventsElement.querySelector('.trip-events__list');

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._noPointComponent = new NoPointView();
    this._siteMenuComponent = new SiteMenuView();
    this._filtersComponent = new FiltersView();

    this._sortComponent = null;

    this._pointPresenter = {};
    this._tripInformationPresenter = {};

    this._currentSortType = SortType.DAY;

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._eventsListElement, this._handleViewAction, this._handleModeChange);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSiteMenu();
    this._renderTripEvents();
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();

    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDay);

      case SortType.TIME:
        return filteredPoints.sort(sortTime);

      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }
  }

  _renderSiteMenu() {
    render(this._siteMenuElement, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;

      case UpdateType.MINOR:
        this._clearEventPointsList();
        this._renderTripEvents();
        break;

      case UpdateType.MAJOR:
        this._clearEventPointsList({resetSortType: true});
        this._renderTripEvents();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEventsTable();
    this._renderEventsTable(this._getPoints());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    render(this._tripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();

    Object.values(this._pointPresenter).forEach((currentValue) => currentValue.resetView());
  }

  _renderEventPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsListElement, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderTripInformation(points) {
    this._tripInformationPresenter = new TripInformationPresenter(this._tripMainElement);

    this._tripInformationPresenter.init(points);
  }

  _renderEventsTable(points) {
    this._renderSort();
    this._renderEventList(points);
  }

  _renderEventList(points) {
    points.forEach((currentValue) => this._renderEventPoint(currentValue));
  }

  _renderNoPoints() {
    render(this._tripEventsElement, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _clearEventPointsList({resetSortType = false} = {}) {
    this._newPointPresenter.destroy();
    this._clearEventsTable();

    if (this._tripInformationPresenter.destroy) {
      this._tripInformationPresenter.destroy();
    }

    this._tripInformationPresenter = {};

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _clearEventsTable() {
    Object.values(this._pointPresenter).
      forEach((currentValue) => {
        currentValue.destroy();
      });

    this._pointPresenter = {};

    remove(this._sortComponent);

    remove(this._noPointComponent);
  }

  _renderTripEvents() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderEventsTable(points);
    this._renderTripInformation(points);
  }
}

export default Trip;
