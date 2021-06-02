import {MenuItem, UpdateType, INIT_ERROR_MESSAGE} from './const.js';
import {RenderPosition, render, remove} from './util/render.js';
import PointsModel from './model/points.js';
import TripPresenter from './presenter/trip.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 5mkr';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const pageMainElement = document.querySelector('.page-main');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const newPointButton = tripMainElement.querySelector('.trip-main__event-add-btn');
const siteMenuElement = tripMainElement.querySelector('.trip-controls__navigation');
const pageMainContainerElement = pageMainElement.querySelector('.page-body__container');

const siteMenuComponent = new SiteMenuView();

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const api = new Api(END_POINT, AUTHORIZATION);

let tripPresenter = null;

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  if (siteMenuElement.querySelector(`[data-type="${menuItem}"]`)
    .classList.contains('trip-tabs__btn--active')) {
    return;
  }

  siteMenuComponent.setMenuItem(menuItem);

  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      newPointButton.disabled = false;

      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      newPointButton.disabled = true;

      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const filterPresenter = new FilterPresenter(filtersElement, filterModel, handleSiteMenuClick);

const destinationsRequest = api.getDestinations();
const offersRequest = api.getOffers();
const pointsRequest = api.getPoints();

Promise.all([destinationsRequest, offersRequest, pointsRequest])
  .then((results) => {
    const [destinations, offers, points] = results;

    tripPresenter = new TripPresenter(tripMainElement, pageMainElement, pointsModel, filterModel, offers, destinations, api);
    tripPresenter.init();

    pointsModel.setPoints(UpdateType.INIT, points);

    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(siteMenuElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

    filterPresenter.init();

    newPointButton.addEventListener('click', () => {
      tripPresenter.createPoint();
      newPointButton.disabled = true;
    });
  }).catch(() => {
    alert(INIT_ERROR_MESSAGE);
  });
