import { useAtomValue, useSetAtom } from "jotai";
import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useHeightScrollPercentage } from "../../../../lib/hooks/useHeightScrollPercentage";
import { useWebSocket } from "../../../../lib/hooks/useWebSocket";
import { privateApiCall, sendNumSignal } from "../../../../lib/utility";
import {
  inventoryItemSignal,
  inventoryParamsAtom,
} from "../../../../store/inventory";
import { InventoryItem, PagedResponse, WsMsg } from "../../../../type";
import { GridItem } from "./GridItem";

export const GridItemWrapper = () => {
  const params = useAtomValue(inventoryParamsAtom);
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
  const inventorySignal = useSetAtom(inventoryItemSignal);
  const signalRef = useRef(inventorySignal);
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
  const heightScrollPercentage = useHeightScrollPercentage(500);
  const fetchRef = useRef(fetchNextPage);
  const isFetchingRef = useRef<boolean>();
  isFetchingRef.current = isFetchingNextPage;
  const hasNextPageRef = useRef<boolean>();
  hasNextPageRef.current = hasNextPage;
  useEffect(() => {
    if (
      heightScrollPercentage >= 85 &&
      !(isFetchingRef.current || !hasNextPageRef.current)
    ) {
      fetchRef.current();
    }
  }, [heightScrollPercentage]);
  const onMessage = useCallback((e: MessageEvent<WsMsg>) => {
    const data: WsMsg = JSON.parse(e.data as unknown as string);
    switch (data.event) {
      case "refreshInventory":
        signalRef.current(sendNumSignal);
        break;
      default:
        break;
    }
  }, []);
  useWebSocket(onMessage, ["refreshInventory"]);

  if (error) return <div>{`${error}`}</div>;
  if (!data) return <div>在庫がありません</div>;
  return (
    <>
      <div className="w-full grid p-2 lg:p-3 grid-cols-3 lg:grid-cols-7 overflow-auto gap-4">
        {data.pages
          .flatMap((res) => res.data)
          .map((item, i) => (
            <GridItem key={item.itemCodeExt} item={item} index={i} />
          ))}
        <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </div>
    </>
  );
};
