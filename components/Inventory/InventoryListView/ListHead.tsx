import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { showHeaderAtom } from "../../../store/inventory";
import { Color } from "../../../styles/Color";

export const ListHead = () => {
  const [showShadow] = useAtom(showHeaderAtom);

  return (
    <Wrapper showShadow={showShadow}>
      <TableCell />
      <TableCell>品番</TableCell>
      <TableCell>品名</TableCell>
      <TableCell>サイズ</TableCell>
      <TableCell>色</TableCell>
      <TableCell>在庫数</TableCell>
      <TableCell>更新日時</TableCell>
    </Wrapper>
  );
};

interface WrapperProps {
  showShadow: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  display: grid;
  grid-template-columns: 7% 13% 25% 5% 5% 10% 25%;
  grid-template-rows: 1fr;
  border-bottom: 1px solid ${Color.SUB};
  ${(props) => (props.showShadow ? "box-shadow: 0 9px 7px -6px gray; " : null)}
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
