import Observer from '../util/observer.js';

import {FilterType} from '../const.js';

class Filter extends Observer {
  constructor() {
    super();

    this._currentFilter = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._currentFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._currentFilter;
  }
}

export default Filter;
