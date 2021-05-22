import TripEventsListView from '../view/trip-events-list.js';
import NoPointView from '../view/no-point.js';
import SortView from '../view/sort.js';
import {render, RenderPosition} from '../util/render.js';
import PointPresenter from './point.js';
import {updateItem} from '../util/common.js';

class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = {};

    this._tripEventsListComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();
    this._sortComponent = new SortView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(eventPoints) {
    this._eventPoints = eventPoints.slice();

    render(this._tripEventsContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderTripEvents();
  }

  _handlePointChange(updatePoint) {
    this._eventPoints = updateItem(this._eventPoints, updatePoint);
    this._pointPresenter[updatePoint.id].init(updatePoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((currentValue) => currentValue.resetView());
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
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
