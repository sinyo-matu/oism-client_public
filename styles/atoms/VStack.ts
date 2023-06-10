import styled from "styled-components";

interface VStackProps {
  justify: "start" | "end" | "center" | "between" | "around";
}
export const VStack = styled.div<VStackProps>`
  width: 100%;
  gap: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(props) => {
    switch (props.justify) {
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "center":
        return "center";
      case "between":
        return "space-between";
      case "around":
        return "space-around";
    }
  }};
`;
