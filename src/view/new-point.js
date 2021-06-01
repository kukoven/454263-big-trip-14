import dayjs from 'dayjs';
import he from 'he';
import {TYPES, DEFAULT_TIME_DIFFERENCE} from '../const.js';
import {formatDateForEditPoint} from '../util/point.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createDestinationDatalistTemplate = (destinations) => {
  let optionsMarkup = '';

  destinations.forEach((destination) => {
    optionsMarkup += `<option value="${destination.name}"></option>`;
  });

  return optionsMarkup;
};

const createOptionOffersTemplate = (allOffersOfCurrentType, checkedOffers, isDisabled) => {
  const allOffers = allOffersOfCurrentType.offers;

  if (!allOffers.length) {
    return '';
  }
  let optionsMarkup = '';
  allOffers.forEach((offer, index) => {
    const isChecked  = checkedOffers.find((checkedOffer) => {
      return checkedOffer.title === offer.title;
    });
    const id = `event-offer-${offer.title.toLowerCase().split(' ').join('-')}-${index + 1}`;

    optionsMarkup += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" value="${offer.title}" name="${id}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });

  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${optionsMarkup}
      </div>
    </section>`;
};

const createEventTypeItemsTemplate = (chosenType, types, isDisabled) => {
  let itemsMarkup = '';

  types.forEach((currentType) => {
    itemsMarkup += `<div class="event__type-item">
      <input id="event-type-${currentType.toLowerCase()}" class="event__type-input  visually-hidden" type="radio" ${isDisabled ? 'disabled' : ''} name="event-type" value="${currentType.toLowerCase()}" ${currentType.toLowerCase() === chosenType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${currentType.toLowerCase()}" for="event-type-${currentType.toLowerCase()}">${currentType}</label>
    </div>`;
  });

  return itemsMarkup;
};

const createPicturesTemplate = (pictures) => {
  let picturesMarkup = '';
  pictures.forEach((picture) => {
    picturesMarkup += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return picturesMarkup;
};

const createNewPointTemplate = (point, offersData, destinationsData, isDisabled) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    isSaving,
  } = point;

  const checkedOffers = point.offers;
  const destinations = destinationsData;
  const allOffersOfCurrentType = offersData.find((item) => {
    return item.type === type;
  });

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeItemsTemplate(type, TYPES, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination"
                   id="event-destination-1"
                   type="text" name="event-destination"
                   value="${he.encode(destination.name)}" list="destination-list-1"  ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
                ${createDestinationDatalistTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${formatDateForEditPoint(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${formatDateForEditPoint(dateTo)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>
        </header>
        <section class="event__details">

          ${createOptionOffersTemplate(allOffersOfCurrentType, checkedOffers)}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createPicturesTemplate(destination.pictures)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

class NewPoint extends SmartView {
  constructor(point, allOffers, allDestinations) {
    super();
    this._data = NewPoint.createPointBlank(point, allDestinations);

    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._destinations = allDestinations;
    this._offers = allOffers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._pointTypeToggleHandler = this._pointTypeToggleHandler.bind(this);
    this._pointCityToggleHandler = this._pointCityToggleHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._basicPriceChangeHandler = this._basicPriceChangeHandler.bind(this);

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);

    this._setFromDatepicker();
    this._setToDatepicker();
  }

  reset(point) {
    this.updateData(
      NewPoint.parsePointToData(point),
    );
  }

  _setFromDatepicker() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._data.dateFrom).toDate(),
        onChange: this._dateFromChangeHandler,
      },
    );
  }

  _setToDatepicker() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        enableTime: true,
        time_24hr: true,
        minDate: dayjs(this._data.dateFrom).toDate(),
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._data.dateTo).toDate(),
        onChange: this._dateToChangeHandler,
      },
    );
  }

  _dateFromChangeHandler([userDate]) {
    const isFromAfterTo = userDate > this._data.dateTo;

    this.updateData({
      dateFrom: userDate,
      dateTo: isFromAfterTo ?
        dayjs(userDate).add(DEFAULT_TIME_DIFFERENCE, 'hour') :
        this._data.dateTo,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    const newCityName = this.getElement().querySelector('#event-destination-1');

    if (this._getDestinationList(this._destinations).indexOf(newCityName.value) === -1) {
      newCityName.value = '';
      return;
    }

    this._callback.formSubmit(NewPoint.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._pointTypeToggleHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._pointCityToggleHandler);

    this.getElement()
      .querySelector('#event-price-1')
      .addEventListener('change', this._basicPriceChangeHandler);

    const offersSectionElement = this.getElement().querySelector('.event__section--offers');

    if (offersSectionElement) {
      offersSectionElement.addEventListener('change', this._offersChangeHandler);
    }
  }

  _offersChangeHandler(evt) {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }
    const justDataUpdating = true;
    const selectedOfferName = evt.target.value;

    const selectedOfferIndex = this._data.offers.findIndex((offer) => {
      return offer.title === selectedOfferName;
    });

    if (selectedOfferIndex < 0) {
      const currentOffer = this._offers.find((offers) => {
        return offers.type === this._data.type;
      }).offers.find((offer) => {
        return offer.title === selectedOfferName;
      });

      this.updateData({
        offers: [currentOffer, ...this._data.offers],
      }, justDataUpdating);
    } else {
      this.updateData({
        offers: [...this._data.offers.slice(0, selectedOfferIndex), ...this._data.offers.slice(selectedOfferIndex + 1)],
      }, justDataUpdating);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  getTemplate() {
    return createNewPointTemplate(this._data, this._offers, this._destinations);
  }

  _pointTypeToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _getDestinationList(destinations) {
    const destinationList = destinations.map((destination) => destination.name);
    return destinationList;
  }

  _pointCityToggleHandler(evt) {
    const newCityName = evt.currentTarget.value;

    if (newCityName === this._data.destination) {
      return;
    } else if (this._getDestinationList(this._destinations).indexOf(newCityName) === -1) {
      evt.currentTarget.value = '';
      return;
    }

    const destinationItem = this._destinations.find((destination) => {
      return destination.name === newCityName;
    });

    if (destinationItem) {
      this.updateData({
        destination: destinationItem,
      });
    }
  }

  _basicPriceChangeHandler(evt) {
    const newPrice = parseInt(evt.currentTarget.value);

    const justDataUpdating = true;

    this.updateData({
      basePrice: newPrice,
    }, justDataUpdating);
  }

  static parsePointToData(point) {
    const data = Object.assign({},
      point,
      {
        isDisabled: false,
        isSaving: false,
      });

    return data;
  }

  static parseDataToPoint(data) {
    const point = Object.assign({}, data);

    delete point.isDisabled;
    delete point.isSaving;

    return point;
  }

  static createPointBlank(point, destinations) {
    if (point) {
      return NewPoint.parsePointToData(point);
    }

    const pointBlank = {
      type: TYPES[0].toLowerCase(),
      destination: destinations[0],
      dateFrom: dayjs().toDate(),
      dateTo: dayjs().toDate(),
      basePrice: 0,
      isFavorite: false,
      description: '',
      offers: [],
    };

    return NewPoint.parsePointToData(pointBlank);
  }
}

export default NewPoint;
