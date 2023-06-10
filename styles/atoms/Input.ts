import styled from "styled-components";
import { Color } from "../Color";

interface InputProps {
  themeColor?: string;
  isError?: boolean;
}

const Input = styled.input<InputProps>`
  @media screen and (max-width: 1024px) {
    width: 150px;
  }
  padding: 5px;
  border: 1px solid
    ${(props) => (props.themeColor ? props.themeColor : Color.SUB)};
  box-sizing: border-box;
  border-radius: 5px;
  outline: none;
  width: 150px;
  &:hover {
    box-shadow: 0px 0px 0.3em
      ${(props) => (props.themeColor ? props.themeColor : Color.MAIN)};
    border-color: ${(props) =>
      props.themeColor ? props.themeColor : Color.MAIN};
  }
  &:focus {
    box-shadow: 0px 0px 0.3em 2px
      ${(props) => (props.themeColor ? props.themeColor : Color.MAIN)};
    border-color: ${(props) =>
      props.themeColor ? props.themeColor : Color.MAIN};
  }
  transition: 0.2s;
  ${(props) =>
    props.isError
      ? `box-shadow: 0 0 0.3em ${Color.Error};border-color:${Color.Error}`
      : null};
`;

export default Input;
