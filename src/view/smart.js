import AbstractView from './abstract.js';

class Smart extends AbstractView {

  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    this.updateElement();
  }
}

export default Smart;
