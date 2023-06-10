import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useWebSocket } from "../../lib/hooks/useWebSocket";
import { sendNumSignal } from "../../lib/utility";
import { returnIdsAtom, returnsAtomSignal } from "../../store/returnList";
import { deriveFadeIn } from "../../styles/animation";
import { WsMsg } from "../../type";
import { DeleteAlertModal } from "./DeleteAlertModal";
import { ListItem } from "./ListItem";

export const GridView = () => {
  const { t } = useTranslation();
  const [ids] = useAtom(returnIdsAtom);
  const sendReturnListSignal = useSetAtom(returnsAtomSignal);
  const onMessage = useCallback(
    (m: MessageEvent<any>) => {
      const data: WsMsg = JSON.parse(m.data as unknown as string);
      switch (data.event) {
        case "refreshReturnList":
          sendReturnListSignal(sendNumSignal);
          break;
        default:
          break;
      }
    },
    [sendReturnListSignal]
  );
  useWebSocket(onMessage, ["refreshReturnList"]);

  useEffect(() => {
    sendReturnListSignal(sendNumSignal);
  }, [sendReturnListSignal]);
  if (ids.length === 0)
    return <div>{t("pattern.noItem", { name: t("return") })}</div>;
  return (
    <FadeInWrapper>
      {ids.map((id) => (
        <ListItem key={id.id} fromParent={id} />
      ))}
      <DeleteAlertModal />
    </FadeInWrapper>
  );
};

const Wrapper = styled.div`
  max-width: 1280px;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
  padding: 10px;
  grid-auto-rows: 280px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const FadeInWrapper = deriveFadeIn(Wrapper);
