import styled from "styled-components";
import { PopUp } from "../animation";
import { Color } from "../Color";

interface ButtonPropers {
  clicked?: boolean;
  buttontype?: "circle" | "pill";
  selected?: boolean;
  fontSize?: string;
  padding?: string;
  color?: string;
  sizeType?: "fitText";
  disabled?: boolean;
}

const Button = styled.button<ButtonPropers>`
  display: inline-block;
  ${(props) => (props.fontSize ? `font-size:${props.fontSize};` : null)};
  background-color: ${(props) =>
    props.selected ? props.color || Color.MAIN : "white"};
  min-height: 20px;
  min-width: ${(props) => (props.sizeType === "fitText" ? "none" : "50px")};
  border: 1px solid ${(props) => props.color || Color.MAIN};
  border-radius: ${(props) =>
    props.buttontype === "circle" ? "50%" : "9999px"};
  color: ${(props) =>
    props.selected ? Color.Default : props.color || Color.MAIN};
  text-align: center;
  padding: ${(props) => props.padding || "0.4rem"};
  cursor: pointer;
  box-shadow: 0px 0px 0.3em -1px ${(props) => props.color || Color.MAIN};
  ${(props) => (props.clicked ? PopUp : null)};
  &:hover,
  &:focus {
    box-shadow: 0px 0px 0.5em -1px ${(props) => props.color || Color.MAIN};
  }
  ${(props) =>
    props.disabled
      ? `
  background-color: white;
  color: #edede9 ;
    box-shadow:0px 0px 0.3em -1px  #edede9;
  border: 1px solid #edede9;
  &:hover{
    box-shadow:0px 0px 0.3em -1px  #edede9;
  }
  cursor:default;
  `
      : null};
  transition: 0.2s;
  --webkit-transition: 0.2s;
`;

export default Button;
