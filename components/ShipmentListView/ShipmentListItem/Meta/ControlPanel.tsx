import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import React from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import {
  changeStatusAlertOpenAtom,
  deleteAlertOpenAtom,
  exportOpenAtom,
  shipmentForChange,
  shipmentForExport,
  shipmentForUpdateAtom,
  updateOpenAtom,
} from "../../../../store/shipmentList";
import { shipmentForDelete } from "../../../../store/shipmentList";
import { Shipment } from "../../../../type/shipment";
import { ButtonCompo } from "../../../ButtonCompo";

export const ControlPanel = ({ shipment }: { shipment: Shipment }) => {
  const { t } = useTranslation();
  const [, setModalOpen] = useAtom(deleteAlertOpenAtom);
  const [, setItemForDelete] = useAtom(shipmentForDelete);
  const setExportItem = useSetAtom(shipmentForExport);
  const setExportModalOpen = useSetAtom(exportOpenAtom);
  const setChangeStatusItem = useSetAtom(shipmentForChange);
  const setChangeStatusOpen = useSetAtom(changeStatusAlertOpenAtom);
  const setUpdateItem = useSetAtom(shipmentForUpdateAtom);
  const setUpdateOpen = useSetAtom(updateOpenAtom);
  const handleDeleteOnClick = async () => {
    setModalOpen(true);
    setItemForDelete(shipment);
  };
  const handleExportOnClick = async () => {
    setExportItem([shipment, false]);
    setExportModalOpen(true);
  };
  const handleExportOrderedOnClick = async () => {
    setExportItem([shipment, true]);
    setExportModalOpen(true);
  };
  const handleChangeStatus = async () => {
    setChangeStatusItem(shipment);
    setChangeStatusOpen(true);
  };
  const handleChangeShipment = () => {
    setUpdateOpen(true);
    setUpdateItem(shipment);
  };

  return (
    <Wrapper className="controlPanel">
      <ButtonCompo onClick={handleExportOrderedOnClick} fontSize="0.7rem">
        {t("exportOrdered")}
      </ButtonCompo>
      <ButtonCompo onClick={handleExportOnClick} fontSize="0.7rem">
        {t("export")}
      </ButtonCompo>
      <ButtonCompo onClick={handleDeleteOnClick} fontSize="0.7rem">
        {t("conceal")}
      </ButtonCompo>
      <ButtonCompo onClick={handleChangeStatus} fontSize="0.7rem">
        {t("status") + t("change")}
      </ButtonCompo>
      <ButtonCompo onClick={handleChangeShipment} fontSize="0.7rem">
        {t("change")}
      </ButtonCompo>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  box-sizing: border-box;
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  opacity: 0;
  transition: 0.5s;
  gap: 3px;
`;
