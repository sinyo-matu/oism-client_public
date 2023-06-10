import { useAtom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useCallback } from "react";
import styled from "styled-components";
import { useWebSocket } from "../../../lib/hooks/useWebSocket";
import { sendNumSignal } from "../../../lib/utility";
import {
  isManualInputAtom,
  itemAtom,
  itemIsInStockSignalAtom,
} from "../../../store/newOrder";
import { WsMsg } from "../../../type";
import { ItemInfo } from "./ItemInfo";
import { ItemSuggestion } from "./ItemSuggestion";
import { ManualInput } from "./ManualInput";

export const ItemSuggestionAndInfo = () => {
  const [item] = useAtom(itemAtom);
  const isManual = useAtomValue(isManualInputAtom);
  const sendIsInStockSignal = useSetAtom(itemIsInStockSignalAtom);
  const onMessage = useCallback(
    (m: MessageEvent<any>) => {
      const data: WsMsg = JSON.parse(m.data as unknown as string);
      switch (data.event) {
        case "refreshInventoryItemQuantity":
          sendIsInStockSignal(sendNumSignal);
          break;
        default:
          break;
      }
    },
    [sendIsInStockSignal]
  );
  useWebSocket(onMessage, ["refreshInventoryItemQuantity"]);
  if (isManual)
    return (
      <Wrapper>
        <ManualInput />
      </Wrapper>
    );
  if (item) {
    return (
      <Wrapper>
        <ItemInfo item={item} />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <ItemSuggestion />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  grid-area: info;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
