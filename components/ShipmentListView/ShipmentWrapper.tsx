import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { useHeightScrollPercentage } from "../../lib/hooks/useHeightScrollPercentage";
import { useWebSocket } from "../../lib/hooks/useWebSocket";
import { privateApiCall, sendNumSignal } from "../../lib/utility";
import {
  shipmentsAtomSignal,
  shipmentStatusSignalAtom,
  shipmentParamsAtom,
} from "../../store/shipmentList";
import { fadeIn } from "../../styles/animation";
import { PagedResponse, WsMsg } from "../../type";
import { Shipment } from "../../type/shipment";
import { ShipmentListItem } from "./ShipmentListItem";
export const ShipmentWrapper = () => {
  const params = useAtomValue(shipmentParamsAtom);
  const fetcher = async ({ pageParam = 0 }) => {
    const response = await privateApiCall<PagedResponse<Shipment>>(
      `/shipment?${params}&page=${pageParam}`,
      "GET"
    ).catch((err) => {
      console.log(err);
    });
    if (!response) throw Error("can not get orders");
    return response;
  };
  const sendShipmentListSignal = useSetAtom(shipmentsAtomSignal);
  const sendShipmentStatusSignal = useSetAtom(shipmentStatusSignalAtom);
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
  const onMessage = useCallback(
    (m: MessageEvent<any>) => {
      const data: WsMsg = JSON.parse(m.data as unknown as string);
      switch (data.event) {
        case "refreshShipmentList":
          sendShipmentListSignal(sendNumSignal);
          refetch();
          break;
        case "refreshShipmentItem":
          sendShipmentStatusSignal(([, signal]) => [data.message, !signal]);
        default:
          break;
      }
    },
    [sendShipmentListSignal, refetch, sendShipmentStatusSignal]
  );
  useWebSocket(onMessage, ["refreshShipmentList", "refreshShipmentItem"]);
  useEffect(() => {
    sendShipmentListSignal(sendNumSignal);
  }, [sendShipmentListSignal]);
  if (error) return <div>{`${error}`}</div>;
  if (!data) return <div>出荷がありません</div>;
  return (
    <Wrapper>
      {data.pages
        .flatMap((res) => res.data)
        .map((shipment, i) => {
          return (
            <ListItemWrapper delay={i} key={shipment.id}>
              <ShipmentListItem fromParent={shipment} />
            </ListItemWrapper>
          );
        })}
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </Wrapper>
  );
};

interface ListItemProps {
  delay: number;
}

const ListItemWrapper = styled.div<ListItemProps>`
  width: 100%;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease ${(props) => props.delay * 30}ms;
  animation-fill-mode: forwards;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 5px 10px;
  overflow-x: hidden;
`;
