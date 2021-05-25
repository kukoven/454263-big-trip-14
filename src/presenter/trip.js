import TripEventsListView from '../view/trip-events-list.js';
import NoPointView from '../view/no-point.js';
import SortView from '../view/sort.js';
import {render, RenderPosition} from '../util/render.js';
import PointPresenter from './point.js';
import {updateItem} from '../util/common.js';
import {SortType} from '../const.js';
import {sortDay, sortTime, sortPrice} from '../util/point.js';

class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._tripEventsListComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();
    this._sortComponent = new SortView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(eventPoints) {
    this._eventPoints = eventPoints.slice().sort(sortDay);
    this._sourcedEventPoints = eventPoints.slice();
    render(this._tripEventsContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderTripEvents();
  }

  _handlePointChange(updatePoint) {
    this._eventPoints = updateItem(this._eventPoints, updatePoint);
    this._sourcedEventPoints = updateItem(this._sourcedEventPoints, updatePoint);
    this._pointPresenter[updatePoint.id].init(updatePoint);
  }

  _sortEventPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._eventPoints.sort(sortDay);
        break;
      case SortType.TIME:
        this._eventPoints.sort(sortTime);
        break;
      case SortType.PRICE:
        this._eventPoints.sort(sortPrice);
        break;
      default:
        this._eventPoints = this._sourcedEventPoints;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEventPoints(sortType);
    this._clearEventPointsList();
    this._renderEventList();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((currentValue) => currentValue.resetView());
  }

  _renderEventPoint(point) {
    const pointPresenter = new PointPresenter(this._tripEventsListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderEventList() {
    this._eventPoints.forEach((currentValue) => this._renderEventPoint(currentValue));
  }

  _renderNoPoints() {
    render(this._tripEventsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _clearEventPointsList() {
    Object
      .values(this._pointPresenter)
      .forEach((currentValue) => currentValue.destroy());
    this._pointPresenter = {};
  }

  _renderTripEvents() {
    if (this._eventPoints.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderEventList();
  }
}

export default Trip;
