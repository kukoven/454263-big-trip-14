import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-type="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
      <a class="trip-tabs__btn" href="#" data-type="${MenuItem.STATS}">${MenuItem.STATS}</a>
    </nav>`
  );
};

class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('trip-tabs__btn')) {
      this._callback.menuClick(evt.target.dataset.type);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');

    items.forEach((currentValue) => {
      currentValue.classList.remove('trip-tabs__btn--active');
    });

    const currentItem = this.getElement().querySelector(`[data-type="${menuItem}"]`);
    currentItem.classList.add('trip-tabs__btn--active');
  }
}

export default SiteMenu;
