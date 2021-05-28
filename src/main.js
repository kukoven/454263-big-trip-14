import {generatePoint} from './mock/point.js';
import PointsModel from './model/points.js';
import TripPresenter from './presenter/trip.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';

const POINTS_COUNT = 15;

const tripMainElement = document.querySelector('.trip-main');
const pageMainElement = document.querySelector('.page-main');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const newPointButton = tripMainElement.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterPresenter = new FilterPresenter(filtersElement, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(tripMainElement, pageMainElement, pointsModel, filterModel);
tripPresenter.init();

newPointButton.addEventListener('click', () => {
  tripPresenter.createPoint();
});
