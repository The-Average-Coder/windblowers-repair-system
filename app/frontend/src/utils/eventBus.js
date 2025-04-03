const eventBus = {
  listeners: new Map(),
  lastEmitted: new Map(),

  emit(event, payload) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.lastEmitted.set(event, payload); // Store latest event
    this.listeners.get(event).forEach((callback) => callback(payload));
  },

  on(event, callback, emitMostRecent = false) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Immediately call listener with the last emitted value (if it exists)
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
