import React from "react";
import styled from "styled-components";
import { Color } from "../../../../styles/Color";

export const OrderItemHeader = () => {
  return (
    <Wrapper>
      <div></div>
      <div></div>
      <InfoCell>品番</InfoCell>
      <InfoCell>サイズ/色</InfoCell>
      <InfoCell>在庫</InfoCell>
      <InfoCell>状態</InfoCell>
      <InfoCell>価格</InfoCell>
      <div></div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 10% 10% 15% 10% 15% 15% 10% 15%;
  width: 100%;
  gap: 5px;
  border-bottom: 1px solid ${Color.SUB};
`;

const InfoCell = styled.div`
  text-align: center;
`;
