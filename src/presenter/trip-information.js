import TripInformationContainerView from '../view/trip-iformation-container.js';
import TripInformationView from '../view/trip-information.js';
import TripCostView from '../view/trip-cost.js';
import {RenderPosition, render, remove} from '../util/render.js';


class TripInformation {
  constructor(tripMain) {
    this._tripMain = tripMain;

    this._tripInformationContainerComponent = null;
    this._tripInformationComponent = null;
    this._tripCostComponent = null;
  }

  init(points) {
    this._tripInformationContainerComponent = new TripInformationContainerView();

    this._renderTripInformationContainer();

    this._tripInformationElement = this._tripMain.querySelector('.trip-info');

    this._renderAllInfo(points);
  }

  destroy() {
    remove(this._tripInformationContainerComponent);
    remove(this._tripInformationComponent);
    remove(this._tripCostComponent);
  }

  _renderTripInformationContainer() {
    render(this._tripMain, this._tripInformationContainerComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInformation(points) {
    this._tripInformationComponent = new TripInformationView(points);
    render(this._tripInformationElement, this._tripInformationComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost(points) {
    this._tripCostComponent = new TripCostView(points);
    render(this._tripInformationElement, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _renderAllInfo(points) {
    this._renderTripInformation(points);
    this._renderTripCost(points);
  }
}

export default TripInformation;
