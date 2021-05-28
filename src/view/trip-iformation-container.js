import AbstractView from './abstract.js';

function createTripInformationContainerTemplate() {
  return `<section class="trip-main__trip-info  trip-info">
    </section>`;
}

class TripInformationContainer extends AbstractView {
  getTemplate() {
    return createTripInformationContainerTemplate();
  }
}

export default TripInformationContainer;
