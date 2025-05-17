export type Callback = (eventData: unknown) => void;

export class EventEmitter {
  map = new Map<string, Callback[]>();

  on(eventName: string, callback: Callback) {
    console.log("[MusicBox EM] listen:", eventName, callback);
    if (!this.map.has(eventName)) this.map.set(eventName, []);
    const listeners = this.map.get(eventName);

    if(listeners) {
      listeners.push(callback);
    }
  }
  emit(eventName: string, eventData: unknown) {
    console.log("[MusicBox EM] emit:", eventName, eventData);
    const handlers = this.map.get(eventName);

    if(handlers) {
      handlers.map(handler => handler(eventData));
    }
  }
}
