import {Callback} from "./callback";

interface ListenerDetails {
  eventName: string;
  eventCb: string | Callback;
}

export {ListenerDetails};
