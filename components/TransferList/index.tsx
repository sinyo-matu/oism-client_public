import React, { Suspense } from "react";
import styled from "styled-components";
import { DeleteAlertModal } from "./DeleteAlertModal";
import { GridView } from "./GridView";
import { ListViewControlArea } from "./ListViewControlArea";
import { UpdateTransferModal } from "./UpdateTransferModal";

export const TransferListView = () => {
  return (
    <Wrapper>
      <ListViewControlArea />
      <Suspense fallback={"loading"}>
        <GridView />
      </Suspense>
      <DeleteAlertModal />
      <UpdateTransferModal />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;
