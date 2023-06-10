import styled from "styled-components";
import { Color } from "../Color";
interface Props {
  myIsActive: boolean;
}
const Compo = styled.a<Props>`
  height: 80%;
  display: flex;
  min-width: 50px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 2px solid
    ${(props) => (props.myIsActive ? Color.MAIN : "transparent")};
  &:hover {
    background-color: ${Color.MAIN};
    color: ${Color.Default};
  }
  ${(props) =>
    props.myIsActive
      ? `box-shadow: 0px 0px 0.5em ${Color.MAIN};background-color:${Color.MAIN};`
      : null};
  color: ${(props) => (props.myIsActive ? Color.Default : Color.SUB)};
  border-radius: 9999px;
  font-size: 14px;
  padding: 0 8px;
  transition: 0.2s;
`;

export default Compo;
