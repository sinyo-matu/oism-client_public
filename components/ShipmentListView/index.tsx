import React, { Suspense } from "react";
import styled from "styled-components";
import { ChangeStatusAlertModal } from "./ChangeStatusAlertModal";
import { DeleteAlertModal } from "./DeleteAlertModal";
import { ExportByIdsModal } from "./ExportByIdsModal";
import { ExportModal } from "./ExportModal";
import { ListViewControlArea } from "./ListViewControlArea";
import { ShipmentWrapper } from "./ShipmentWrapper";
import { UpdateShipmentModal } from "./UpdateShipmentModal";

export const ShipmentListView = () => {
  return (
    <Wrapper>
      <ListViewControlArea />
      <Suspense fallback={"loading"}>
        <ShipmentWrapper />
      </Suspense>
      <DeleteAlertModal />
      <ExportModal />
      <Suspense fallback="">
        <ExportByIdsModal />
      </Suspense>
      <ChangeStatusAlertModal />
      <UpdateShipmentModal />
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
