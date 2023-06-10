import { useAtomValue, useSetAtom } from "jotai";
import throttle from "lodash.throttle";
import React, { useCallback, useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { useWebSocket } from "../../../lib/hooks/useWebSocket";
import { privateApiCall, sendNumSignal } from "../../../lib/utility";
import {
  clearItemListAtom,
  inventoryItemParamsAtom,
  returnInventorySuggestionSignalAtom,
  returnItemsListAtom,
} from "../../../store/newReturn";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { InventoryItem, PagedResponse, Quantity, WsMsg } from "../../../type";
import { getEmptyQuantity, InventoryLocation } from "../../../type/inventory";
import { SuggestionItem } from "./SuggestionItem";

export const ItemSuggestion = () => {
  const params = useAtomValue(inventoryItemParamsAtom);
  const fetcher = async ({ pageParam = 0 }) => {
    const response = await privateApiCall<PagedResponse<InventoryItem>>(
      `/inventory?${params}&page=${pageParam}`,
      "GET"
    ).catch((err) => {
      console.log(err);
    });
    if (!response) throw Error("can not get orders");
    return response;
  };
  const {
    isError,
    hasNextPage,
    error,
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(["orders", params], fetcher, {
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.next;
    },
  });

  const fetch = useMemo(
    () => throttle(() => fetchNextPage(), 500),
    [fetchNextPage]
  );
  const isFetchingRef = useRef<boolean>();
  isFetchingRef.current = isFetchingNextPage;
  const hasNextPageRef = useRef<boolean>();
  hasNextPageRef.current = hasNextPage;
  const handleListWrapperOnScroll = (
    e: React.UIEvent<HTMLDivElement, UIEvent>
  ) => {
    const percentage =
      ((e.currentTarget.scrollTop + e.currentTarget.offsetHeight) /
        e.currentTarget.scrollHeight) *
      100;
    if (
      percentage >= 85 &&
      !(isFetchingRef.current || !hasNextPageRef.current)
    ) {
      fetch();
    }
  };
  const returnItemsList = useAtomValue(returnItemsListAtom);
  const clearReturnItemList = useSetAtom(clearItemListAtom);
  const sendSuggestionSignal = useSetAtom(returnInventorySuggestionSignalAtom);
  const onMessage = useCallback(
    (m: MessageEvent<any>) => {
      const data: WsMsg = JSON.parse(m.data);
      switch (data.event) {
        case "refreshInventory":
          sendSuggestionSignal(sendNumSignal);
          //TODO should remove items that changed instead of just clear List
          clearReturnItemList();
          break;
        default:
          break;
      }
    },
    [sendSuggestionSignal, clearReturnItemList]
  );
  useWebSocket(onMessage, ["refreshInventory"]);

  if (error) return <div>{`${error}`}</div>;
  if (!data)
    return <Wrapper justify="start">返品できるものがありません</Wrapper>;
  return (
    <Wrapper justify="start">
      <HStack justify="start">
        <Title>返品可能品リスト</Title>
        <Notice>
          <div>*日本在庫のみ表示</div>
        </Notice>
      </HStack>
      <ListWrapper onScroll={handleListWrapperOnScroll}>
        {data.pages
          .flatMap((res) => res.data)
          .map((i) => {
            const item = returnItemsList.get(i.itemCodeExt);
            if (!item) return i;
            const [target] = item;
            return {
              itemCodeExt: i.itemCodeExt,
              updateAt: i.updateAt,
              createdAt: i.createdAt,
              operationIds: i.operationIds,
              quantity: [
                {
                  location: InventoryLocation.JP,
                  quantity:
                    i.quantity[0].quantity - target.quantity[0].quantity,
                } as Quantity,
                ...getEmptyQuantity(),
              ],
            };
          })
          .filter((i) => i.quantity[0].quantity !== 0)
          .map((item, i) => (
            <SuggestionItem key={item.itemCodeExt} item={item} index={i} />
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
