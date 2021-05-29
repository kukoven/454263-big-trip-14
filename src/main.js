import {MenuItem} from './const.js';
import {generatePoint} from './mock/point.js';
import {RenderPosition, render, remove} from './util/render.js';
import PointsModel from './model/points.js';
import TripPresenter from './presenter/trip.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';

const POINTS_COUNT = 5;

const tripMainElement = document.querySelector('.trip-main');
const pageMainElement = document.querySelector('.page-main');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const newPointButton = tripMainElement.querySelector('.trip-main__event-add-btn');
const siteMenuElement = tripMainElement.querySelector('.trip-controls__navigation');
const pageMainContainerElement = pageMainElement.querySelector('.page-body__container');

const filterModel = new FilterModel();

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const siteMenuComponent = new SiteMenuView();
render(siteMenuElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

let statisticsComponent = null;

const filterPresenter = new FilterPresenter(filtersElement, filterModel);
const tripPresenter = new TripPresenter(tripMainElement, pageMainElement, pointsModel, filterModel);

const handleSiteMenuClick = (menuItem) => {
  if (siteMenuElement.querySelector(`[data-type="${menuItem}"]`)
    .classList.contains('trip-tabs__btn--active')) {
    return;
  }

  siteMenuComponent.setMenuItem(menuItem);

  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.showEventsTable();
      newPointButton.disabled = false;

      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.hideEventsTable();
      newPointButton.disbled = true;

      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

newPointButton.addEventListener('click', () => {
  tripPresenter.createPoint();

  newPointButton.disabled = true;
});
