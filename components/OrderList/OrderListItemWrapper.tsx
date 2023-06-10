import { useAtomValue, useSetAtom } from "jotai";
import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { useWebSocket } from "../../lib/hooks/useWebSocket";
import { privateApiCall, sendNumSignal } from "../../lib/utility";
import {
  orderItemsSignal,
  ordersAtomSignal,
  ordersParamsAtom,
} from "../../store/orderList";
import { fadeIn } from "../../styles/animation";
import { PagedResponse, WsMsg } from "../../type";

import { OrderListItem } from "./OrderListItem";
import { useHeightScrollPercentage } from "../../lib/hooks/useHeightScrollPercentage";
import { Order } from "../../type/order";
import { useTranslation } from "next-i18next";
export const OrderListItemWrapper = () => {
  const { t } = useTranslation();
  const params = useAtomValue(ordersParamsAtom);
  const fetchOrders = async ({ pageParam = 0 }) => {
    const response = await privateApiCall<PagedResponse<Order>>(
      `/orders?${params}&page=${pageParam}`,
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
  } = useInfiniteQuery(["orders", params], fetchOrders, {
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
  const sendOrderListSignal = useSetAtom(ordersAtomSignal);
  const sendOrderItemsSignal = useSetAtom(orderItemsSignal);
  const onMessage = useCallback(
    (m: MessageEvent<any>) => {
      const data: WsMsg = JSON.parse(m.data as unknown as string);
      console.log(data.event);
      switch (data.event) {
        case "refreshOrderList":
          sendOrderListSignal(sendNumSignal);
          refetch();
          break;
        case "refreshOrderItem":
          sendOrderItemsSignal(([, old]) => [data.message, !old]);
          break;
        default:
          break;
      }
    },
    [sendOrderItemsSignal, sendOrderListSignal, refetch]
  );
  useWebSocket(onMessage, ["refreshOrderList", "refreshOrderItem"]);

  useEffect(() => {
    sendOrderListSignal(sendNumSignal);
  }, [sendOrderListSignal]);
  if (error) return <div>{`${error}`}</div>;
  if (!data) return <div>{t("pattern.noItem", { name: t("order") })}</div>;
  return (
    <Wrapper>
      {data.pages
        .flatMap((res) => res.data)
        .map((order, i) => {
          return (
            <ListItemWrapper delay={i} key={order.id}>
              <OrderListItem fromParent={order} />
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;
