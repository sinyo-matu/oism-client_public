import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import {
  infoItemInStockAtom,
  itemIsInStockAtom,
} from "../../../../store/newOrder";
import { Color } from "../../../../styles/Color";
import { Quantity } from "../../../../type";

export const InStockInfoCell = () => {
  const { t } = useTranslation("inventory");
  const [isInStock] = useAtom(itemIsInStockAtom);
  const [inOrderQuantity] = useAtom(infoItemInStockAtom);
  return (
    <Wrapper>
      <Label>在庫状況:</Label>
      <Content>
        {isInStock.map((q: Quantity) => {
          const count = inOrderQuantity.filter(
            (iq) => iq.location === q.location
          )[0].quantity;
          return (
            <TextWrapper isInStock={q.quantity >= count} key={q.location}>
              {t(`location.${q.location}`)}
            </TextWrapper>
          );
        })}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const Label = styled.div`
  text-align: start;
  width: 20%;
`;
const Content = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

interface TextContentProps {
  isInStock: boolean;
}

const TextWrapper = styled.div<TextContentProps>`
  min-width: 50px;
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) =>
    props.isInStock ? Color.Success : Color.Error};
  border: 1px solid
    ${(props) => (props.isInStock ? Color.Success : Color.Error)};
  color: ${Color.Default};
  border-radius: 999px;
  padding: 0px 7px;
`;
