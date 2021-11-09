interface GetWatchers {
  type: "GET_WATCHERS";
  watchers: [index: number];
}

interface GET_JSP {
  type: "GET_JSP"
}


export type MessageType = GetWatchers | GET_JSP