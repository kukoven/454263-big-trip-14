import SiteMenuView from './view/site-menu.js';
import TripInformationView from './view/trip-information.js';
import TripCostView from './view/trip-cost.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import TripEventsList from './view/trip-events-list.js';
import EditPointView from './view/edit-point.js';
import PointView from './view/point.js';
import NoPointView from './view/no-point.js';
import {generatePoint} from './mock/point.js';
import {render, RenderPosition} from './util.js';

const POINTS_COUNT = 15;

const pageHeader = document.querySelector('.page-header');
const tripMainContainer = pageHeader.querySelector('.trip-main');
const menuContainer = pageHeader.querySelector('.trip-controls__navigation');
const filtersContainer = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

const points = new Array(POINTS_COUNT).fill().map(generatePoint).sort((a, b) => {
  if (a.dateTo > b.dateTo) {return 1;}
  if (a.dateTo < b.dateTo) {return -1;}
  return 0;
});

if (points.length === 0) {
  render(tripEvents, new NoPointView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(tripMainContainer, new TripInformationView(points).getElement(), RenderPosition.AFTERBEGIN);
  const tripInformationContainer = pageHeader.querySelector('.trip-info');
  render(tripInformationContainer, new TripCostView(points).getElement(), RenderPosition.BEFOREEND);
  render(tripEvents, new SortView().getElement(), RenderPosition.BEFOREEND);
}

render(menuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new TripEventsList().getElement(), RenderPosition.BEFOREEND);
render(filtersContainer, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const tripEventsList = pageMain.querySelector('.trip-events__list');

const renderPoint = (pointsListElement, point) => {
  const pointComponent = new PointView(point);

  const editPointComponent = new EditPointView(point);
  const replacePointToEditForm = () => {
    pointsListElement.replaceChild(editPointComponent.getElement(), pointComponent.getElement());

  };
  const replaceEditFormToPoint = () => {
    pointsListElement.replaceChild(pointComponent.getElement(), editPointComponent.getElement());

  };
  const onEscKeyDawn = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDawn);
    }

  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToEditForm();

    document.addEventListener('keydown', onEscKeyDawn);
    editPointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEditFormToPoint();
    });
  });

  editPointComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceEditFormToPoint();

    document.removeEventListener('click', onEscKeyDawn);
  });
  render(pointsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);

};

for (let i = 0; i < POINTS_COUNT; i++) {
  renderPoint(tripEventsList, points[i]);
}

