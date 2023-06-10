import { useSetAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  deleteAlertOpenAtom,
  returnForDelete,
  updateOpenAtom,
  transferForUpdateAtom,
} from "../../../../store/transferList";
import { Transfer } from "../../../../type/transfer";
import { ButtonCompo } from "../../../ButtonCompo";

export const ControlPanel = ({ item }: { item: Transfer }) => {
  const setDeleteModalOpen = useSetAtom(deleteAlertOpenAtom);
  const setItemForDelete = useSetAtom(returnForDelete);
  const setUpdateModalOpen = useSetAtom(updateOpenAtom);
  const setItemForUpdate = useSetAtom(transferForUpdateAtom);
  const handleDeleteOnClick = async () => {
    setDeleteModalOpen(true);
    setItemForDelete(item);
  };
  const handleUpdateOnClick = async () => {
    setUpdateModalOpen(true);
    setItemForUpdate(item);
  };
  return (
    <Wrapper className="controlPanel">
      <ButtonCompo onClick={handleUpdateOnClick} fontSize="0.8rem">
        変更
      </ButtonCompo>
      <ButtonCompo onClick={handleDeleteOnClick} fontSize="0.8rem">
        取消
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
  gap: 5px;
  align-items: center;
  opacity: 0;
  transition: 0.5s;
`;
