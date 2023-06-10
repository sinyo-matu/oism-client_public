import { useAtom } from "jotai";
import React from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import {
  deleteAlertOpenAtom,
  orderForDelete,
} from "../../../../store/orderList";
import { Order } from "../../../../type/order";
import { ButtonCompo } from "../../../ButtonCompo";

export const ControlPanel = ({ order }: { order: Order }) => {
  const { t } = useTranslation();
  const [, setModalOpen] = useAtom(deleteAlertOpenAtom);
  const [, setItemForDelete] = useAtom(orderForDelete);
  const handleDeleteOnClick = async () => {
    setModalOpen(true);
    setItemForDelete(order);
  };
  return (
    <Wrapper className="controlPanel">
      <ButtonCompo onClick={handleDeleteOnClick} fontSize="0.5rem">
        {t("delete")}
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
`;
