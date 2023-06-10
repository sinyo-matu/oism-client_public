import React from "react";
import styled from "styled-components";
import { ShipmentListView } from "../components/ShipmentListView";
import { deriveFadeIn } from "../styles/animation";

export const ShipmentListLayout = () => {
  return (
    <FadeInContent>
      <ShipmentListView />
    </FadeInContent>
  );
};

const Content = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1280px;
`;
const FadeInContent = deriveFadeIn(Content);
