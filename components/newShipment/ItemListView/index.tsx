import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useCallback } from "react";
import styled from "styled-components";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../lib/utility";
import {
  shipmentItemListAtom,
  shipmentLocationAtom,
} from "../../../store/newShipment";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { ListItem } from "./ListItem";
export const ItemListView = () => {
  const { t } = useTranslation("shipments");
  const [shipmentItemList, setShipmentItemList] = useAtom(shipmentItemListAtom);
  const setLocation = useSetAtom(shipmentLocationAtom);
  const remover = useCallback(
    (i: number) => {
      let temp = shipmentItemList;
      temp.splice(i, 1);
      setShipmentItemList([...temp]);
      if (shipmentItemList.length === 0) setLocation(null);
    },
    [setShipmentItemList, shipmentItemList, setLocation]
  );
  return (
    <Wrapper justify="start">
      <HStack justify="between">
        <div>合計:{shipmentItemList.length}点</div>
        <div>
          合計:
          {convertToJPYCurrencyFormatString(
            convertWithTaxPriceToWithOutTaxPrice(
              shipmentItemList.reduce((sum, [item, price], i) => {
                sum += price * item.rate;
                return sum;
              }, 0)
            )
          )}
        </div>
      </HStack>
      <ListItemWrapper>
        {shipmentItemList.length === 0 ? (
          <div>{t("common.pleaseApplyOrder")}</div>
        ) : (
          shipmentItemList.map(([shipmentItem], i) => {
            return (
              <ListItem
                key={shipmentItem.id}
                index={i}
                item={shipmentItem}
                remover={remover}
              />
            );
          })
        )}
      </ListItemWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(VStack)`
  grid-area: lst;
  width: 100%;
`;

const ListItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 240px);
  gap: 10px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 5px;
`;
