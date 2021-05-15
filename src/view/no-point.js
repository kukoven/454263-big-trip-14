import AbstractView from './abstract.js';

const createNoPointTemplate = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

class NoPoint extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

export default NoPoint;
