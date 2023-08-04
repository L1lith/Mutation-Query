import { createParser } from "css-selector-parser";

class MutationQuery {
  constructor(query=null, callbacks=null) {
    autoBind(this)
    this.parse = createParser();
    this.events = { "*": [], added: [], removed: [], existing: [] };
    if (callbacks !== null) {
        if (typeof callbacks != 'object') throw new Error("Expected a callbacks object")
        Object.entries(callbacks).forEach(([event, callback]) => {
            if (!this.events.hasOwnProperty(eventName))
                throw new Error("Invalid Event Name")
            if (typeof callback != 'function') throw new Error("Callback is not a function")
            this.events[eventName].push(callback)
        })
    }
    if (query !== null) {
        if (typeof query != 'string') throw new Error("Expected a string for the query")
        this.scan(query)
    }
  }
  on(eventName = "*", callback) {
    if (!this.events.hasOwnProperty(eventName))
      throw new Error("Invalid Event Name");
    if (typeof callback != 'function') throw new Error("Callback is not a function")    const events = this.events[eventName];
    if (!events.includes(callback)) events.push(callback);
  }
  off(eventName = "*", callback) {
    if (!this.events.hasOwnProperty(eventName))
      throw new Error("Invalid Event Name");
    if (typeof callback != 'function') throw new Error("Callback is not a function")
    const events = this.events[eventName];
    const index = events.indexOf(callback);
    if (index >= 0) events.splice(index, 1);
  }
  _emit(eventName, ...args) {
    if (!this.events.hasOwnProperty(eventName) || eventName === "*")
      throw new Error("Invalid Event Name");
    const events = this.events[eventName];
    events.forEach(handler => handler(...args))
    events['*'].forEach(handler => handler(eventName, ...args))
  }
  scan(query) {
    if (this.events.existing.length > 0) {
        const existing = document.querySelectorAll(query)
        if (existing.length > 0) {
            this._emit('existing', existing)
        }
    }
    const selector = this.parse(query)
  }
}

export default MutationQuery;
