const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const DEFAULT_TIME_DIFFERENCE = 1;

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

const INIT_ERROR_MESSAGE = 'Проблемы с сервером, обновите страницу';

export {
  TYPES,
  SortType,
  DEFAULT_TIME_DIFFERENCE,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem,
  INIT_ERROR_MESSAGE
};
