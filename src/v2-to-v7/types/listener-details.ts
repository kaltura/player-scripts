interface ListenerDetails {
  eventName: string;
  eventCallback: (...args: any[]) => void;
}

export {ListenerDetails};
