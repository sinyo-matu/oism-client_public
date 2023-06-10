import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { useHeightScrollPercentage } from "../../lib/hooks/useHeightScrollPercentage";
import { useWebSocket } from "../../lib/hooks/useWebSocket";
import { privateApiCall, sendNumSignal } from "../../lib/utility";
import {
  registersAtomSignal,
  registersParamsAtom,
} from "../../store/registerList";
import { deriveFadeIn } from "../../styles/animation";
import { PagedResponse, Register, WsMsg } from "../../type";
import { DeleteAlertModal } from "./DeleteAlertModal";
import { ListItem } from "./ListItem";

export const GridView = () => {
  const { t } = useTranslation(["message", "common"]);
  const params = useAtomValue(registersParamsAtom);
  const sendRegisterListSignal = useSetAtom(registersAtomSignal);
  const fetcher = async ({ pageParam = 0 }) => {
    const response = await privateApiCall<PagedResponse<Register>>(
      `/registers?${params}&page=${pageParam}`,
      "GET"
    );
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
        case "refreshRegisterList":
          sendRegisterListSignal(sendNumSignal);
          refetch();
          break;
        default:
          break;
      }
    },
    [sendRegisterListSignal, refetch]
  );
  useWebSocket(onMessage, ["refreshRegisterList"]);

  useEffect(() => {
    sendRegisterListSignal(sendNumSignal);
  }, [sendRegisterListSignal]);
  if (error) return <div>{`${error}`}</div>;
  if (!data)
    return (
      <div>
        {t("pattern.noItem", {
          ns: "common",
          name: t("register", { ns: "common" }),
        })}
      </div>
    );
  return (
    <FadeInWrapper>
      {data.pages
        .flatMap((res) => res.data)
        .map((register) => (
          <ListItem fromParent={register} key={register.id} />
        ))}
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      <DeleteAlertModal />
    </FadeInWrapper>
  );
};

const Wrapper = styled.div`
  max-width: 1280px;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
  padding: 10px;
  grid-auto-rows: 280px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const FadeInWrapper = deriveFadeIn(Wrapper);
