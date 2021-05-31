import {FilterType} from '../const.js';
import {isPointFuture, isPointPast} from './point.js';

const filter = {
  [FilterType.FUTURE]: (points) => points.filter((currentValue) => isPointFuture(currentValue.dateTo)),
  [FilterType.PAST]: (points) => points.filter((currentValue) => isPointPast(currentValue.dateFrom)),
  [FilterType.EVERYTHING]: (points) => points,
};

export {filter};
