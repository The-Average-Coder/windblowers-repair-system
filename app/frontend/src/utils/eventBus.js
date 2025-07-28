/*
  A utility used regularly in the app to allow easy communication between components
  using an events system. The subject emits data, and any observers can perform operations
  based on this data.
*/

const eventBus = {
  listeners: new Map(),
  lastEmitted: new Map(),

  emit(event, payload) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.lastEmitted.set(event, payload);
    this.listeners.get(event).forEach((callback) => callback(payload));
  },

  on(event, callback, emitMostRecent = false) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // If active, immediately call listener with the last emitted value (if it exists)
    if (this.lastEmitted.has(event) && emitMostRecent) {
      callback(this.lastEmitted.get(event));
    }
  },

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.set(
        event,
        this.listeners.get(event).filter((cb) => cb !== callback)
      );
    }
  },
};

export default eventBus;
