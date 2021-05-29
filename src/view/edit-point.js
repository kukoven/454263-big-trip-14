import dayjs from 'dayjs';
import he from 'he';
import {CITIES, TEST_TEXT, TYPES, OFFERS, DEFAULT_TIME_DIFFERENCE} from '../const.js';
import {findOffersType, formatDateForEditPoint} from '../util/point.js';
import SmartView from './smart.js';
import {generatePictures, getRandomDescription} from '../mock/point.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  type: '',
  destination: '',
  dateFrom: '',
  dateTo: '',
  basePrice: '',
  description: '',
  offers: [],
};

const createEditPointTemplate = (point) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers,
  } = point;

  const checkedType = type;

  const renderTypeElements = () => {
    return TYPES.map((currentValue) => `
      <div class="event__type-item">
        <input id="event-type-${currentValue.toLowerCase()}-1"
               class="event__type-input  visually-hidden"
               type="radio"
               name="event-type"
               value="${currentValue.toLowerCase()}"
               ${currentValue === checkedType || currentValue.toLowerCase() === checkedType ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${currentValue.toLowerCase()}"
               for="event-type-${currentValue.toLowerCase()}-1">
        ${currentValue}
        </label>
      </div>
    `).join('');
  };

  const generateOffersElement = () => {
    if (offers.length > 0) {
      return `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offers.map((currentValue) => `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden"
                     id="event-offer-luggage-${currentValue.price}"
                     type="checkbox"
                     name="event-offer-luggage"
                     ${currentValue.isChecked ? 'checked' : ''}
                     data-offer-title="${currentValue.title}">
              <label class="event__offer-label" for="event-offer-luggage-${currentValue.price}">
                <span class="event__offer-title">${currentValue.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${currentValue.price}</span>
              </label>
            </div>`).join('')}
          </div>
        </section>`;
    }

    return '';
  };

  const cityDataList = CITIES.map((currentValue) => {
    return `
      <option value="${currentValue}"></option>
    `;
  }).join('');

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${checkedType.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${renderTypeElements()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${checkedType}
            </label>
            <input class="event__input  event__input--destination"
                   id="event-destination-1"
                   type="text" name="event-destination"
                   value="${he.encode(destination.name)}" list="destination-list-1">
            <datalist id="destination-list-1">
                ${cityDataList}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${formatDateForEditPoint(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${formatDateForEditPoint(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">

          ${generateOffersElement()}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${point.destination.pictures.map((item) => `
                  <img class="event__photo" src="${item.src}" alt="${item.destination}">
                `).join('')}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

class EditPoint extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._data = EditPoint.parsePointToData(point);

    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._pointTypeToggleHandler = this._pointTypeToggleHandler.bind(this);
    this._pointCityToggleHandler = this._pointCityToggleHandler.bind(this);
    this._pointOffersToggleHandler = this._pointOffersToggleHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._deletePointClickHandler = this._deletePointClickHandler.bind(this);
    this._basicPriceChangeHandler = this._basicPriceChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
    this.setDeleteClickHandler(this._callback.deleteClick);

    this._setFromDatepicker();
    this._setToDatepicker();
  }

  reset(point) {
    this.updateData(
      EditPoint.parsePointToData(point),
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

  _formCloseHandler() {
    this._callback.formClose();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    const newCityName = this.getElement().querySelector('#event-destination-1');

    if (CITIES.indexOf(newCityName.value) === -1) {
      newCityName.value = '';
      return;
    }

    this._callback.formSubmit(EditPoint.parseDataToPoint(this._data));
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._pointTypeToggleHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._pointCityToggleHandler);

    if (this.getElement().querySelector('.event__available-offers') !== null) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._pointOffersToggleHandler);
    }

    this.getElement()
      .querySelector('#event-price-1')
      .addEventListener('change', this._basicPriceChangeHandler);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formCloseHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _basicPriceChangeHandler(evt) {
    const newPrice = parseInt(evt.currentTarget.value);

    const justDataUpdating = true;

    this.updateData({
      basePrice: newPrice,
    }, justDataUpdating);
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _pointTypeToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: findOffersType(OFFERS, evt.target.value),
    });
  }

  _pointCityToggleHandler(evt) {
    const newCityName = evt.currentTarget.value;

    if (newCityName === this._data.destination) {
      return;
    }

    if (CITIES.indexOf(newCityName) === -1) {
      evt.currentTarget.value = '';
      return;
    }

    if (CITIES.includes(evt.target.value)) {
      this.updateData({
        destination: {
          description: getRandomDescription(TEST_TEXT),
          name: evt.target.value,
          pictures: generatePictures(),
        },
      });
    }
  }

  _pointOffersToggleHandler(evt) {
    this.updateData({
      offers: this._data.offers.map((currentValue) => {
        if (currentValue.title === evt.target.dataset.offerTitle) {
          currentValue.isChecked = !currentValue.isChecked;
        }

        return currentValue;
      }),
    });
  }

  _deletePointClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPoint.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deletePointClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToPoint(data) {
    return Object.assign({}, data);
  }
}

export default EditPoint;
