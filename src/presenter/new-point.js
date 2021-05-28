import NewPointView from '../view/new-point.js';
import {nanoid} from 'nanoid';
import {RenderPosition, render, remove} from '../util/render.js';
import {UserAction, UpdateType} from '../const.js';

class NewPoint {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._newPointComponent = null;

    this._handleEscDown = this._handleEscDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._newPointComponent !== null) {
      return;
    }

    this._newPointComponent = new NewPointView();

    this._newPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._newPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._newPointComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._handleEscDown);
  }

  destroy() {
    if (this._newPointComponent === null) {
      return;
    }

    remove(this._newPointComponent);
    this._newPointComponent = null;

    document.removeEventListener('keydown', this._handleEscDown);
  }

  _handleEscDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.destroy();
      document.removeEventListener('keydown', this._handleEscDown);
    }
  }

  _handleFormSubmit(updatedPoint) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({}, updatedPoint, {id: nanoid()}),
    );

    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }
}

export default NewPoint;
