class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers
      .filter((currentValue) => currentValue !== observer);
  }

  _notify(event, payload) {
    this._observers.forEach((currentValue) => currentValue(event, payload));
  }
}

export default Observer;
