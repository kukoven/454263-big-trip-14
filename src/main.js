import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInformationTemplate} from './view/trip-information.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFiltersTemplate} from './view/filters.js';
import {createTripSortTemplate} from './view/sort.js';
import {createTripEventsListTemplate} from './view/trip-events-list.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {generatePoint} from './mock/point.js';

const POINTS_COUNT = 15;

const pageHeader = document.querySelector('.page-header');
const menuContainer = pageHeader.querySelector('.trip-controls__navigation');
const tripControls = pageHeader.querySelector('.trip-controls');
const filtersContainer = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

const points = new Array(POINTS_COUNT).fill().map(generatePoint).sort((a, b) => {
  if (a.dateTo > b.dateTo) {return 1;}
  if (a.dateTo < b.dateTo) {return -1;}
  return 0;
});

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(menuContainer, createSiteMenuTemplate(), 'beforeend');
render(tripControls, createTripInformationTemplate(points), 'beforebegin');

const tripInformationContainer = pageHeader.querySelector('.trip-info');

render(tripInformationContainer, createTripCostTemplate(points), 'beforeend');
render(filtersContainer, createFiltersTemplate(), 'beforeend');
render(tripEvents, createTripSortTemplate(), 'beforeend');
render(tripEvents, createTripEventsListTemplate(), 'beforeend');

const tripEventsList = pageMain.querySelector('.trip-events__list');

render(tripEventsList, createEditPointTemplate(points[0]), 'beforeend');

for (let i = 1; i < POINTS_COUNT; i++) {
  render(tripEventsList, createPointTemplate(points[i]), 'beforeend');
}
