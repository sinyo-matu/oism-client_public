import React, { Suspense } from "react";
import styled from "styled-components";
import { ExportModal } from "./ExportModal";
import { GridItemWrapper } from "./GridItemWrapper";
import { InventoryItemDetailModal } from "./InventoryItemDetailModal";

export const InventoryListView = () => {
  return (
    <Wrapper>
      <Suspense fallback={"loading"}>
        <GridItemWrapper />
      </Suspense>
      <InventoryItemDetailModal />
      <ExportModal />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;
