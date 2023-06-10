import { useAtomValue } from "jotai";
import React from "react";
import { ReadyState } from "react-use-websocket";
import styled from "styled-components";
import { wsReadyStateAtom } from "../lib/hooks/useWebSocket";
import { stringifyWsReadyState } from "../lib/utility";
import { Color } from "../styles/Color";

function getDotColor(readyState: ReadyState) {
  switch (readyState) {
    case -1:
      return "gray";
    case 0:
      return Color.Warning;
    case 1:
      return Color.Success;

    case 2:
      return Color.Warning;
    default:
      return Color.Error;
  }
}

export const ConnectionBadge = () => {
  const readyState = useAtomValue(wsReadyStateAtom);
  return (
    <Wrapper>
      <Dot readyState={readyState}>●</Dot>
      <StateText readyState={readyState}>
        {stringifyWsReadyState(readyState)}
      </StateText>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  gap: 10px;
  user-select: none;
`;
interface DotProps {
  readyState: ReadyState;
}
const Dot = styled.div<DotProps>`
  color: ${(props) => getDotColor(props.readyState)}DD;
  font-size: 12px;
  text-shadow: 0 0 2px ${(props) => getDotColor(props.readyState)};
  text-align: center;
  transition: 100ms;
`;

interface DotProps {
  readyState: ReadyState;
}
const StateText = styled.div<DotProps>`
  font-family: "Shrikhand", cursive;
  font-size: 14px;
  text-align: center;
  transition: 100ms;
  transform: translateY(2px);
`;
