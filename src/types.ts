interface ADD_WATCHER {
  type: "ADD_WATCHER";
  watcher: string;
}
interface REFRESH_UI_WATCHERS {
  type: "REFRESH_UI_WATCHERS";
  watchers: [index: number];
}

interface DELETE_WATCHER {
  type: "DELETE_WATCHER";
  watcher: string;
}

export type MessageType = ADD_WATCHER | REFRESH_UI_WATCHERS | DELETE_WATCHER