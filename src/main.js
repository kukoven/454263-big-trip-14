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
import {render, RenderPosition, replace} from './util/render.js';

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
  render(tripEvents, new NoPointView(), RenderPosition.BEFOREEND);
} else {
  render(tripMainContainer, new TripInformationView(points), RenderPosition.AFTERBEGIN);
  const tripInformationContainer = pageHeader.querySelector('.trip-info');
  render(tripInformationContainer, new TripCostView(points), RenderPosition.BEFOREEND);
  render(tripEvents, new SortView(), RenderPosition.BEFOREEND);
}

render(menuContainer, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripEvents, new TripEventsList(), RenderPosition.BEFOREEND);
render(filtersContainer, new FiltersView(), RenderPosition.BEFOREEND);

const tripEventsList = pageMain.querySelector('.trip-events__list');

const renderPoint = (pointsListElement, point) => {
  const pointComponent = new PointView(point);
  const editPointComponent = new EditPointView(point);

  const replacePointToEditForm = () => {
    replace(editPointComponent, pointComponent);
  };

  const replaceEditFormToPoint = () => {
    replace(pointComponent, editPointComponent);
  };

  const onEscKeyDawn = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDawn);
    }

  };

  pointComponent.setPointOpenHandler(() => {
    replacePointToEditForm();

    document.addEventListener('keydown', onEscKeyDawn);
  });

  editPointComponent.setFormCloseHandler(() => {
    replaceEditFormToPoint();
  });

  editPointComponent.setFormSubmitHandler(() => {
    replaceEditFormToPoint();

    document.removeEventListener('click', onEscKeyDawn);
  });

  render(pointsListElement, pointComponent, RenderPosition.BEFOREEND);
};

for (let i = 0; i < POINTS_COUNT; i++) {
  renderPoint(tripEventsList, points[i]);
}

