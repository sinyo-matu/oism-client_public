import React, { Suspense, useCallback } from "react";
import styled from "styled-components";
import { ControlPanel } from "../components/newTransfer/ControlPanel";
import { ItemCodeInput } from "../components/newTransfer/ItemCodeInput";
import { ItemListView } from "../components/newTransfer/ItemListView";
import { ItemSuggestion } from "../components/newTransfer/ItemSuggestion";
import { useWebSocket } from "../lib/hooks/useWebSocket";
import { deriveFadeIn } from "../styles/animation";
import Wrapper from "../styles/PageLayoutWrapper";
import { WsMsg } from "../type";

export const NewTransferLayout = () => {
  const onMessage = useCallback((m: MessageEvent<any>) => {
    const data: WsMsg = JSON.parse(m.data as unknown as string);
    switch (data.event) {
      default:
        break;
    }
  }, []);
  useWebSocket(onMessage, []);
  return (
    <Wrapper>
      <FadeInContent>
        <ItemCodeInput />
        <Suspense fallback={""}>
          <ControlPanel />
        </Suspense>
        <Suspense fallback={""}>
          <ItemSuggestion />
        </Suspense>
        <ItemListView />
      </FadeInContent>
    </Wrapper>
  );
};

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 10px;
  grid-auto-rows: 1fr;
  grid-auto-columns: 1fr;
  grid-template-areas:
    "srh srh ctl ctl ctl"
    "info info lst lst lst"
    "info info lst lst lst"
    "info info lst lst lst"
    "info info lst lst lst"
    "info info lst lst lst";
`;
const FadeInContent = deriveFadeIn(Content);
