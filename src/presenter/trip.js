import NoPointView from '../view/no-point.js';
import SortView from '../view/sort.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {render, RenderPosition, remove} from '../util/render.js';
import PointPresenter from './point.js';
import {sortDay, sortTime, sortPrice} from '../util/point.js';
import FiltersView from '../view/filters.js';
import NewPointPresenter from './new-point.js';
import TripInformationPresenter from './trip-information.js';
import {filter} from '../util/filter.js';
import LoadingView from '../view/loading.js';

class Trip {
  constructor(tripMainElement, pageMainElement, pointsModel, filterModel, offers, destinations, api) {

    this._tripMainElement = tripMainElement;
    this._siteMenuElement = this._tripMainElement.querySelector('.trip-controls__navigation');
    this._filtersElement = this._tripMainElement.querySelector('.trip-controls__filters');
    this._newPointButton = tripMainElement.querySelector('.trip-main__event-add-btn');

    this._pageMainElement = pageMainElement;
    this._tripEventsElement = this._pageMainElement.querySelector('.trip-events');
    this._eventsListElement = this._tripEventsElement.querySelector('.trip-events__list');

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._offers = offers;
    this._destinations = destinations;

    this._noPointComponent = null;
    this._filtersComponent = new FiltersView();
    this._loadingComponent = new LoadingView();
    this._isLoading = true;

    this._sortComponent = null;

    this._pointPresenter = {};
    this._tripInformationPresenter = {};

    this._currentSortType = SortType.DAY;
    this._api = api;

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePointCreateFormClose = this._handlePointCreateFormClose.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._eventsListElement, this._handleViewAction, this._newPointButton);
  }

  init() {
    this._renderTripEvents();

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearEventsTable();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _handlePointCreateFormClose() {
    const points = this._getPoints();
    const pointsCount = points.length;

    if (!pointsCount) {
      this._renderNoPoints();
    }
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this._noPointComponent !== null) {
      remove(this._noPointComponent);
      this._noPointComponent = null;
    }

    this._newPointPresenter.init(this._handlePointCreateFormClose, this._offers, this._destinations);
  }

  hideEventsTable() {
    this._tripEventsElement.classList.add('trip-events--hidden');
  }

  showEventsTable() {
    this._tripEventsElement.classList.remove('trip-events--hidden');
    this._handleSortTypeChange(SortType.DAY);
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
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

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    const destinations = this._destinations;
    const offers = this._offers;

    pointPresenter.init(point, offers, destinations);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderTripInformation(points) {
    if (Object.keys(this._tripInformationPresenter).length !== 0) {
      this._tripInformationPresenter.destroy();
      this._tripInformationPresenter = {};
    }

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
    if (this._noPointComponent === null) {
      this._noPointComponent = new NoPointView();
    }

    render(this._tripEventsElement, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._tripEventsElement, this._loadingComponent, RenderPosition.AFTERBEGIN);
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
    remove(this._loadingComponent);
  }

  _renderTripEvents() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
