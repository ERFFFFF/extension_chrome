interface ADD_WATCHER {
  type: "ADD_WATCHER";
  watcher: string;
}
interface REFRESH_UI_WATCHERS {
  type: "REFRESH_UI_WATCHERS";
  watchers: any;
  monitoringStatus: {[key: string]: boolean};
}

interface DELETE_WATCHER {
  type: "DELETE_WATCHER";
  watcher: string;
}

interface TOGGLE_MONITORING {
  type: "TOGGLE_MONITORING";
  watcher: string;
  enabled: boolean;
}

interface GET_JSP {
  type: "GET_JSP";
}

interface GET_INITIAL_DATA {
  type: "GET_INITIAL_DATA";
}

interface UPDATE_LIVE_STATUS {
  type: "UPDATE_LIVE_STATUS";
  liveStatus: {[key: string]: boolean};
}

export type MessageType = 
  ADD_WATCHER 
  | DELETE_WATCHER 
  | REFRESH_UI_WATCHERS 
  | GET_JSP 
  | GET_INITIAL_DATA
  | TOGGLE_MONITORING 
  | UPDATE_LIVE_STATUS