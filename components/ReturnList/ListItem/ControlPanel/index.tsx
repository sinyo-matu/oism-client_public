import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import {
  deleteAlertOpenAtom,
  returnForDelete,
} from "../../../../store/returnList";
import { Return } from "../../../../type/return";
import { ButtonCompo } from "../../../ButtonCompo";

export const ControlPanel = ({ item }: { item: Return }) => {
  const { t } = useTranslation();
  const setModalOpen = useSetAtom(deleteAlertOpenAtom);
  const setItemForDelete = useSetAtom(returnForDelete);
  const handleDeleteOnClick = async () => {
    setModalOpen(true);
    setItemForDelete(item);
  };
  return (
    <Wrapper className="controlPanel">
      <ButtonCompo onClick={handleDeleteOnClick} fontSize="0.8rem">
        {t("conceal")}
      </ButtonCompo>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  opacity: 0;
  transition: 0.5s;
`;
