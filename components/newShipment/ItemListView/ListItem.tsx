import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import {
  clickToCopyToClipboard,
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
  parseItemCode,
  stringifyDateData,
  stringifyOrderItemRate,
} from "../../../lib/utility";
import { fadeIn, PopUpGeneral } from "../../../styles/animation";
import { phItemStore } from "../../../lib/cache";
import { Color } from "../../../styles/Color";
import { OrderItem } from "../../../type/order";
import { CustomImage } from "../../Image";

export const ListItem = ({
  index,
  item,
  remover,
}: {
  index: number;
  item: OrderItem;
  remover: (i: number) => void;
}) => {
  const { t } = useTranslation(["common", "inventory"]);
  const [code, size, color] = parseItemCode(item.itemCodeExt);
  const handleOnClick = () => {
    remover(index);
  };
  return (
    <Wrapper onClick={handleOnClick} delay={index}>
      <HStack justify="start">
        <CustomImage width={65} colorNo={parseInt(color)} itemCode={code} />
        <VStack>
          <HStack justify="between">
            <CustomerName onClick={clickToCopyToClipboard}>
              {item.customerId}
            </CustomerName>
            <RateCell>
              {item.rate !== 1 ? stringifyOrderItemRate(item.rate) : null}
            </RateCell>
            <Meta>
              {convertToJPYCurrencyFormatString(
                convertWithTaxPriceToWithOutTaxPrice(
                  (phItemStore.getExisted(item.itemCodeExt)?.price ?? 0) *
                    item.rate
                )
              )}
            </Meta>
            <Meta>
              {t("ordered")}:{stringifyDateData(item.orderDatetime)}
            </Meta>
          </HStack>
          <HStack justify="start">
            <ItemInfoCell onClick={clickToCopyToClipboard}>{code}</ItemInfoCell>
            <ItemInfoCell>{size}</ItemInfoCell>
            <ItemInfoCell background={Color.MAIN}>{color}</ItemInfoCell>
            <ItemInfoCell>
              {t(`location.${item.location}`, { ns: "inventory" })}
            </ItemInfoCell>
          </HStack>
          <HStack justify="start">
            <div>{item.note}</div>
          </HStack>
        </VStack>
      </HStack>
    </Wrapper>
  );
};

interface WrapperProps {
  delay: number;
}

const Wrapper = styled.div<WrapperProps>`
  background-color: ${Color.Default};
  position: relative;
  height: 100px;
  box-sizing: border-box;
  padding: 2px 7px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${Color.SUB};
  border-radius: 10px;
  gap: 3px;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease ${(props) => props.delay * 30}ms;
  animation-fill-mode: forwards;
  box-shadow: 0px 0px 7px -5px ${Color.Black};
  transition: 0.5s;
  &:hover {
    box-shadow: 0 0 7px -3px ${Color.Black};
    border-color: ${Color.MAIN};
  }
  &::after {
    width: 50px;
    height: 50px;
    text-align: center;
    content: "出";
    position: absolute;
    background-color: transparent;
    box-sizing: border-box;
    padding: 10px;
    border: 2px dashed ${Color.JPRed};
    color: ${Color.JPRed};
    border-radius: 50%;
    opacity: 0;
    animation: ${PopUpGeneral} 0.5s ease-in-out;
    animation-fill-mode: forwards;
    top: 15px;
    right: 5px;
  }
`;

const VStack = styled.div`
  width: 100%;
  display: flex;
  gap: 3px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface HStackProps {
  justify: "start" | "end" | "center" | "between" | "around";
}

const HStack = styled.div<HStackProps>`
  width: 100%;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: ${(props) => {
    switch (props.justify) {
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "center":
        return "center";
      case "between":
        return "space-between";
      case "around":
        return "space-around";
    }
  }};
`;

const Meta = styled.div`
  font-size: 0.7rem;
  color: ${Color.SUB};
`;

const CustomerName = styled.div`
  min-width: 50px;
  box-sizing: border-box;
  text-align: center;
  background-color: ${Color.Default};
  border: 1px solid ${Color.SUB};
  color: ${Color.SUB};
  border-radius: 999px;
  padding: 0px 7px;
`;

interface InfoCellProps {
  color?: string;
  background?: string;
}

const ItemInfoCell = styled.div<InfoCellProps>`
  text-align: center;
  min-width: 40px;
  padding: 1px 7px;
  background-color: ${(props) =>
    props.background ? props.background : Color.SUB};
  border-radius: 999px;
  color: ${(props) => (props.color ? props.color : Color.Default)};
`;

const RateCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-weight: bold;
`;
