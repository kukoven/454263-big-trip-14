import {getTotalDate} from '../util/point.js';
import AbstractView from './abstract.js';
const POINTS_COUNT = 3;

const getTotalRoute = (points) => {
  if (points.length > POINTS_COUNT) {

    return `${points[0].destination.name} - ... - ${points[points.length -1].destination.name}`;

  } else {
    const trips = [];

    points.forEach((currentValue) => {
      trips.push(currentValue.destination.name);
    });

    return trips.join('-');
  }
};

const createTripInformationTemplate = (points) => {
  const totalDate = getTotalDate(points[0].dateFrom, points[points.length - 1].dateTo);
  const totalRoute = getTotalRoute(points);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${totalRoute}</h1>

        <p class="trip-info__dates">${totalDate}</p>
      </div>
    </section>`
  );
};

class TripInformation extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInformationTemplate(this._points);
  }
}

export default TripInformation;
