import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';
import {render, remove, replace, RenderPosition} from '../util/render.js';
import {isEscEvent} from '../util/common.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  EDITING: 'EDITING',
  DEFAULT: 'DEFAULT',
};

class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._escDownHandler = this._escDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointView(point);
    this._editPointComponent = new EditPointView(point);

    this._pointComponent.setPointOpenHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._editPointComponent.setFormCloseHandler(this._handleFormClose);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEditPointComponent === null || prevPointComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editPointComponent, prevEditPointComponent);
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _replacePointToEditForm() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._escDownHandler);

    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._escDownHandler);

    this._mode = Mode.DEFAULT;
  }

  _escDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceEditFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToEditForm();
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );

    this._replaceEditFormToPoint();
  }

  _handleFormClose() {
    this._editPointComponent.reset(this._point);
    this._replaceEditFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}

export default Point;
