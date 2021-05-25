const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const TEST_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
const Sentence = {
  MIN: 1,
  MAX: 5,
};
const CITIES = ['Moscow', 'Saint-Petersburg', 'New-York', 'San-Francisco', 'Tokyo', 'Sydney', 'Hong Kong', 'Bangkok', 'London', 'Paris', 'Istanbul'];
const DAY_GAP = 3;
const HOURS_GAP = 24;
const MINUTES_GAP = 60;

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export {
  TYPES,
  TEST_TEXT,
  Sentence,
  CITIES,
  DAY_GAP,
  HOURS_GAP,
  MINUTES_GAP,
  SortType
};
