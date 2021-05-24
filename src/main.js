import SiteMenuView from './view/site-menu.js';
import TripInformationView from './view/trip-information.js';
import TripCostView from './view/trip-cost.js';
import FiltersView from './view/filters.js';
import {generatePoint} from './mock/point.js';
import {render, RenderPosition} from './util/render.js';
import TripPresenter from './presenter/trip.js';

const POINTS_COUNT = 15;

const pageHeader = document.querySelector('.page-header');
const tripMainContainer = pageHeader.querySelector('.trip-main');
const menuContainer = pageHeader.querySelector('.trip-controls__navigation');
const filtersContainer = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

render(menuContainer, new SiteMenuView(), RenderPosition.BEFOREEND);
render(filtersContainer, new FiltersView(), RenderPosition.BEFOREEND);

if (points.length > 0) {
  render(tripMainContainer, new TripInformationView(points), RenderPosition.AFTERBEGIN);

  const tripInformationContainer = pageHeader.querySelector('.trip-info');
  render(tripInformationContainer, new TripCostView(points), RenderPosition.BEFOREEND);
}

const tripPresenter = new TripPresenter(tripEvents);

tripPresenter.init(points);

