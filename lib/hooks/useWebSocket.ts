import { atom } from "jotai";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";
import useWs, { ReadyState } from "react-use-websocket";
import { WsMsg, WS_MSG_EVENT } from "../../type";
import { isBrowser, WS_URL } from "../utility";
export const wsReadyStateAtom = atom(ReadyState.UNINSTANTIATED);

export const useWebSocket = (
  onMessage: (e: MessageEvent<any>) => void,
  filter: WS_MSG_EVENT[]
) => {
  const setWsReadyState = useSetAtom(wsReadyStateAtom);
  const { readyState, lastMessage } = useWs(isBrowser ? WS_URL : null, {
    onOpen: () => {
      console.log("websocket opened");
    },
    share: false,
    shouldReconnect: () => {
      console.log("will reconnect");
      return true;
    },
    filter: (message) => {
      const msg: WsMsg = JSON.parse(message.data);
      return filter.includes(msg.event);
    },
    onClose: () => console.log("websocket closed"),
    reconnectAttempts: 10,
    reconnectInterval: 5000,
  });
  useEffect(() => {
    if (lastMessage !== null) {
      onMessage(lastMessage);
    }
  }, [lastMessage, onMessage]);
  useEffect(() => {
    if (isBrowser) {
      setWsReadyState(readyState);
      return () => {
        setWsReadyState(ReadyState.UNINSTANTIATED);
      };
    }
  }, [readyState, setWsReadyState]);

  return { readyState };
};
