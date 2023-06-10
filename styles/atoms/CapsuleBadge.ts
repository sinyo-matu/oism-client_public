import styled from "styled-components";
import { Color } from "../Color";

interface CapsuleBadgeProps {
  color?: string;
  background?: string;
  minWidth?: string;
}

export const CapsuleBadge = styled.div<CapsuleBadgeProps>`
  padding: 0 5px;
  min-width: ${(props) => (props.minWidth ? props.minWidth : "50px")};
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${(props) =>
    props.background ? props.background : Color.SUB};
  border-radius: 999px;
  color: ${(props) => (props.color ? props.color : Color.Default)};
`;
