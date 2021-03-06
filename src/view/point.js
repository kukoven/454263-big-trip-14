import {getTimeDifference} from '../util/point.js';
import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createOptionsTemplate = (options) => {
  let optionsMarkup ='';
  options.forEach((option) => {
    optionsMarkup += `<li class="event__offer">
      <span class="event__offer-title">${option.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${option.price}</span>
    </li>`;
  });

  return optionsMarkup;
};

const createPointTemplate = (point) => {
  const {type, destination, dateFrom, dateTo, isFavorite, basePrice, offers} = point;
  const date = dayjs(dateFrom).format('MMM D');
  const timeFrom = dayjs(dateFrom).format('HH:mm');
  const timeTo = dayjs(dateTo).format('HH:mm');
  const timeDifference = getTimeDifference(dateFrom, dateTo);
  const typeLowerCase = type.toLowerCase();
  const optionsMarkup = createOptionsTemplate(offers);

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeLowerCase}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${timeDifference}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${optionsMarkup}
        </ul>
        <button class="${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._pointOpenHandler = this._pointOpenHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _pointOpenHandler() {
    this._callback.pointOpen();
  }

  setPointOpenHandler(callback) {
    this._callback.pointOpen = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._pointOpenHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}

export default Point;
