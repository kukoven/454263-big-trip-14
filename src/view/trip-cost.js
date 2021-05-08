import {createElement} from '../util.js';

export const createTripCostTemplate = (points) => {
  let totalCost = 0;

  points.forEach((currentValue) => {
    totalCost += currentValue.basePrice;
  });

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

class TripCost {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripCost;
