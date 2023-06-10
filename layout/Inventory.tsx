import React from "react";
import styled from "styled-components";
import { ControlPanel } from "../components/Inventory/ControlPanel";
import { InventoryListView } from "../components/Inventory/InventoryListView";
import { deriveFadeIn } from "../styles/animation";

import Wrapper from "../styles/PageLayoutWrapper";

export const Inventory = () => {
  return (
    <Wrapper>
      <FadeInContent>
        <ControlPanel />
        <InventoryListView />
      </FadeInContent>
    </Wrapper>
  );
};

const Content = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const FadeInContent = deriveFadeIn(Content);
