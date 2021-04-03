import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInformationTemplate} from './view/trip-information.js';
import {createTripCoastTemplate} from './view/trip-coast.js';
import {createFiltersTemplate} from './view/filters.js';
import {createTripSortTemplate} from './view/sort.js';
import {createTripEventsListTemplate} from './view/tripEventsList.js';
import {createTripEditTemplate} from './view/tripEdit.js';
import {createNewTripTemplate} from './view/newTrip.js';

const pageHeader = document.querySelector('.page-header');
const menuContainer = pageHeader.querySelector('.trip-controls__navigation');
const tripControls = pageHeader.querySelector('.trip-controls');
const filtersContainer = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(menuContainer, createSiteMenuTemplate(), 'beforeend');
render(tripControls, createTripInformationTemplate(), 'beforebegin');

const tripInformationContainer = pageHeader.querySelector('.trip-info');

render(tripInformationContainer, createTripCoastTemplate(), 'beforeend');
render(filtersContainer, createFiltersTemplate(), 'beforeend');
render(tripEvents, createTripSortTemplate(), 'beforeend');
render(tripEvents, createTripEventsListTemplate(), 'beforeend');

const tripEventsList = pageMain.querySelector('.trip-events__list');

render(tripEventsList, createTripEditTemplate(), 'beforeend');

for (let i = 0; i < 3; i++) {
  render(tripEventsList, createNewTripTemplate(), 'beforeend');
}
