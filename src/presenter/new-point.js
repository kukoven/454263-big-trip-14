import NewPointView from '../view/new-point.js';
import {RenderPosition, render, remove} from '../util/render.js';
import {UserAction, UpdateType} from '../const.js';

class NewPoint {
  constructor(pointListContainer, changeData, newPointButton) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._newPointButton = newPointButton;

    this._newPointComponent = null;
    this._checkPointsCountCallback = null;

    this._handleEscDown = this._handleEscDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(callback, offers, destinations) {
    this._checkPointsCountCallback = callback;

    if (this._newPointComponent !== null) {
      return;
    }

    this._newPointComponent = new NewPointView(undefined, offers, destinations);

    this._newPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._newPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._newPointComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._handleEscDown);
  }

  destroy() {
    this._newPointButton.disabled = false;

    if (this._newPointComponent === null) {
      return;
    }

    remove(this._newPointComponent);
    this._newPointComponent = null;

    document.removeEventListener('keydown', this._handleEscDown);
  }

  setSaving() {
    this._newPointComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._newPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._newPointComponent.shake(resetFormState);
  }

  _handleEscDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._checkPointsCountCallback();
      this.destroy();
      document.removeEventListener('keydown', this._handleEscDown);
    }
  }

  _handleFormSubmit(updatedPoint) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      updatedPoint,
    );
  }

  _handleDeleteClick() {
    this._checkPointsCountCallback();
    this.destroy();
  }
}

export default NewPoint;
