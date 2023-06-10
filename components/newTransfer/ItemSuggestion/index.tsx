import { useAtomValue, useSetAtom } from "jotai";
import throttle from "lodash.throttle";
import React, { useCallback, useRef, useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { useWebSocket } from "../../../lib/hooks/useWebSocket";
import { privateApiCall, sendNumSignal } from "../../../lib/utility";
import {
  fromLocationAtom,
  transferListAtom,
  transferInventorySuggestionSignalAtom,
  clearItemListAtom,
  inventoryItemParamsAtom,
} from "../../../store/newTransfer";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { InventoryItem, PagedResponse, WsMsg } from "../../../type";
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
  const transferItemsList = useAtomValue(transferListAtom);
  const clearTransferItemList = useSetAtom(clearItemListAtom);
  const sendSuggestionSignal = useSetAtom(
    transferInventorySuggestionSignalAtom
  );
  const fromLocation = useAtomValue(fromLocationAtom);
  const onMessage = useCallback(
    (m: MessageEvent<any>) => {
      const data: WsMsg = JSON.parse(m.data);
      switch (data.event) {
        case "refreshInventory":
          sendSuggestionSignal(sendNumSignal);
          //TODO should remove items that changed instead of just clear List
          clearTransferItemList();
          break;
        default:
          break;
      }
    },
    [sendSuggestionSignal, clearTransferItemList]
  );
  useWebSocket(onMessage, ["refreshInventory"]);
  if (error) return <div>{`${error}`}</div>;
  if (!data)
    return <Wrapper justify="start">移動できるものがありません</Wrapper>;
  return (
    <Wrapper justify="start">
      <HStack justify="start">
        <Title>移動可能品リスト</Title>
      </HStack>
      <ListWrapper onScroll={handleListWrapperOnScroll}>
        {data.pages
          .flatMap((res) => res.data)
          .map((item) => {
            const obj = transferItemsList.get(item.itemCodeExt);
            if (!obj) return item;
            const [, cq] = obj;
            return {
              ...item,
              quantity: item.quantity.map((q) => {
                if (q.location === fromLocation) {
                  return {
                    location: q.location,
                    quantity: q.quantity - cq,
                  };
                }
                return q;
              }),
            };
          })
          .filter((i) => {
            const fromLocationIndex = i.quantity.findIndex(
              (q) => q.location === fromLocation
            );
            return i.quantity[fromLocationIndex].quantity !== 0;
          })
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
