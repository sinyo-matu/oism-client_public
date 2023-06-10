import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import {
  deleteAlertOpenAtom,
  registerForDelete,
} from "../../../../store/registerList";
import { Register } from "../../../../type";
import { ButtonCompo } from "../../../ButtonCompo";

export const ControlPanel = ({ register }: { register: Register }) => {
  const { t } = useTranslation();
  const setModalOpen = useSetAtom(deleteAlertOpenAtom);
  const setItemForDelete = useSetAtom(registerForDelete);
  const handleDeleteOnClick = async () => {
    setModalOpen(true);
    setItemForDelete(register);
  };
  return (
    <Wrapper className="controlPanel">
      <ButtonCompo onClick={handleDeleteOnClick} fontSize="0.8rem">
        {t("delete")}
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
