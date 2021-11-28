interface ADD_WATCHER {
  type: "ADD_WATCHER";
  watcher: string;
}
interface REFRESH_UI_WATCHERS {
  type: "REFRESH_UI_WATCHERS";
  watchers: [index: number];
}

interface GET_JSP {
  type: "GET_JSP";
}


export type MessageType = ADD_WATCHER | REFRESH_UI_WATCHERS | GET_JSP