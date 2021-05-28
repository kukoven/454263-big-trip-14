import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

const createFiltersTemplate = (currentFilterType = FilterType.EVERYTHING) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything"
            class="trip-filters__filter-input  visually-hidden"
            type="radio"
            name="trip-filter"
            value="everything"
            ${currentFilterType === FilterType.EVERYTHING ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="future"
        ${currentFilterType === FilterType.FUTURE ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="past"
        ${currentFilterType === FilterType.PAST ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

class Filters extends AbstractView {
  constructor(currentFilterType) {
    super();

    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}

export default Filters;
