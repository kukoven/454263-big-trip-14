import AbstractView from './abstract.js';

const createTripEventsListTemplate = () => {
  return `<ul class="trip-events__list">
</ul>`;
};

class TripEventsList extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}

export default TripEventsList;
