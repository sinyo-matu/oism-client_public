import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import { Color } from "../../../styles/Color";

export const StockHeader = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <div></div>
      <InfoCell>{t("itemNo")}</InfoCell>
      <InfoCell>{t("sizeNo")}</InfoCell>
      <InfoCell>{t("colorNo")}</InfoCell>
      <InfoCell>{t("register") + t("quantity")}</InfoCell>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 10% 30% 20% 20% 20%;
  width: 100%;
  gap: 5px;
  border-bottom: 1px solid ${Color.SUB};
`;

const InfoCell = styled.div`
  text-align: center;
`;
