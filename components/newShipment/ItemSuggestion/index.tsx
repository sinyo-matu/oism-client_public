import { useAtom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useWebSocket } from "../../../lib/hooks/useWebSocket";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
  sendNumSignal,
} from "../../../lib/utility";
import {
  phItemCacheAtom,
  removeShipmentItemListAtom,
  shipmentItemListAtom,
  shipmentItemSuggestionSignalAtom,
  shipmentLocationAtom,
  suggestionsAtom,
} from "../../../store/newShipment";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { WsMsg } from "../../../type";
import { SuggestionItem } from "./SuggestionItem";
export const ItemSuggestion = () => {
  const { t } = useTranslation(["common", "shipments"]);
  const suggestions = useAtomValue(suggestionsAtom);
  const [shipmentItemList] = useAtom(shipmentItemListAtom);
  const removeItemFromNewShipmentBucket = useSetAtom(
    removeShipmentItemListAtom
  );
  const phItemCache = useAtomValue(phItemCacheAtom);
  const shipmentLocation = useAtomValue(shipmentLocationAtom);
  const sendSuggestionSignal = useSetAtom(shipmentItemSuggestionSignalAtom);
  const shipmentItemIds = shipmentItemList.map((item) => item[0].id);
  const filteredSuggestions = useMemo(
    () =>
      suggestions
        .filter((i) => !shipmentItemIds.includes(i.id))
        .filter((i) => {
          if (!shipmentLocation) return true;
          return i.location === shipmentLocation;
        }),
    [shipmentItemIds, shipmentLocation, suggestions]
  );
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const loadPrice = async () => {
      let totalPrice = 0;
      for (const item of filteredSuggestions) {
        const phItem = phItemCache.get(item.itemCodeExt.slice(0, 11));
        totalPrice += convertWithTaxPriceToWithOutTaxPrice(
          (phItem!.price ?? 0) * item.rate
        );
      }
      setTotalPrice(totalPrice);
    };
    loadPrice();
  }, [filteredSuggestions, phItemCache]);
  const onMessage = useCallback(
    (m: MessageEvent<any>) => {
      const data: WsMsg = JSON.parse(m.data);
      switch (data.event) {
        case "refreshWaitForShipmentItemList":
          sendSuggestionSignal(sendNumSignal);
          break;
        case "refreshNewShipmentBucket":
          removeItemFromNewShipmentBucket(data.message);
          break;
        default:
          break;
      }
    },
    [sendSuggestionSignal, removeItemFromNewShipmentBucket]
  );
  useWebSocket(onMessage, [
    "refreshNewShipmentBucket",
    "refreshWaitForShipmentItemList",
  ]);

  if (suggestions.length === 0)
    return (
      <Wrapper justify="center">
        {t("common.noReadyToShip", { ns: "shipments" })}
      </Wrapper>
    );

  return (
    <Wrapper justify="start">
      <HStack justify="start">
        <Title>
          {t("common.readyToShip", { ns: "shipments" }) + t("list")}
        </Title>
        <Notice>
          <div>
            {t("total") + t("amountOfMoney")}:
            {convertToJPYCurrencyFormatString(totalPrice)}
          </div>
        </Notice>
      </HStack>
      <ListWrapper>
        {filteredSuggestions
          .sort((a, b) => a.customerId.localeCompare(b.customerId))
          .sort((a, b) => b.updateAt - a.updateAt)
          .map((item, i) => (
            <SuggestionItem key={item.id} item={item} index={i} />
          ))}
      </ListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(VStack)`
  grid-area: info;
  width: 100%;
`;
const ListWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: calc(100vh - 240px);
  flex-direction: column;
  align-items: enter;
  justify-content: flex-start;
  gap: 10px;
  padding: 5px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Title = styled.div``;

const Notice = styled.div`
  font-size: 0.8rem;
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-end;
`;
