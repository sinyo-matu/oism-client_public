import styled from "styled-components";

interface HStackProps {
  justify: "start" | "end" | "center" | "between" | "around";
}

export const HStack = styled.div<HStackProps>`
  width: 100%;
  display: flex;
  gap: 5px;
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
