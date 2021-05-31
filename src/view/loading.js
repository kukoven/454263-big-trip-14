import AbstractView from './abstract.js';

function createNoPointTemplate() {
  return `<p class="trip-events__msg">
    Loading...
  </p>`;
}

class Loading extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

export default Loading;
