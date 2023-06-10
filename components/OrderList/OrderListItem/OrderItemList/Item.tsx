import { useAtomValue, useSetAtom } from "jotai";
import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { GetHighlightedText } from "../../../../lib/helpComponents";
import {
  clickToCopyToClipboard,
  parseItemCode,
  privateApiCall,
  stringifyOrderItemRate,
} from "../../../../lib/utility";
import {
  concealAlertOpenAtom,
  orderItemForConcealAtom,
  orderItemForUpdateAtom,
  orderItemsSignal,
  queryKeywordAtom,
  updateRateOpenAtom,
} from "../../../../store/orderList";
import { Color } from "../../../../styles/Color";
import { OrderItem, OrderItemStatus } from "../../../../type/order";
import { ButtonCompo } from "../../../ButtonCompo";
import { CustomImage } from "../../../Image";
import { Price } from "./Price";

export const Item = ({ fromParent }: { fromParent: OrderItem }) => {
  const { t } = useTranslation(["common", "orderStatus", "inventory"]);
  const [item, setItem] = useState(fromParent);
  const setItemForConceal = useSetAtom(orderItemForConcealAtom);
  const setConcealAlertOpen = useSetAtom(concealAlertOpenAtom);
  const setItemForUpdate = useSetAtom(orderItemForUpdateAtom);
  const setUpdateRateOpen = useSetAtom(updateRateOpenAtom);
  const searchString = useAtomValue(queryKeywordAtom);
  const signal = useAtomValue(orderItemsSignal);
  const [itemCode, size, color] = parseItemCode(item.itemCodeExt);
  const handleConcealOnClick = () => {
    setItemForConceal(item);
    setConcealAlertOpen(true);
  };

  const handleUpdateRateOnClick = () => {
    setItemForUpdate(item);
    setUpdateRateOpen(true);
  };
  useEffect(() => {
    const loadOrder = async () => {
      let res = await privateApiCall<OrderItem>(
        `/order_items/${fromParent.id}`,
        "GET"
      ).catch((err) => console.log(err));
      setItem(res!);
    };
    const [signalId] = signal;
    if (fromParent.id === signalId) {
      loadOrder();
    }
  }, [fromParent, signal]);

  return (
    <>
      <div className="hidden lg:grid grid-cols-6 relative  w-full rounded-[10px] p-[2px] transition duration-500 hover:bg-mainLight">
        <div className=" cursor-pointer" onClick={handleUpdateRateOnClick}>
          <CustomImage
            width={30}
            itemCode={itemCode}
            colorNo={parseInt(color)}
          />
        </div>
        <div className="absolute top-0 left-0 text-jpRed font-bold">
          {item.rate !== 1 ? stringifyOrderItemRate(item.rate) : null}
        </div>
        <div className="flex gap-1 justify-center">
          <div
            className="cursor-pointer flex justify-center items-center"
            onClick={clickToCopyToClipboard}
          >
            <GetHighlightedText text={itemCode} highlight={searchString} />
          </div>
          <div className="flex items-center justify-center">
            {size !== "9" ? `${size})` : null}
            <ColorCell>{color}</ColorCell>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {t(`location.${item.location}`, { ns: "inventory" })}
        </div>
        <div className="flex items-center justify-center">
          <StatusWrapper status={item.status}>
            {t(item.status, { ns: "orderStatus" })}
          </StatusWrapper>
        </div>
        <div
          className={`flex items-center justify-center ${
            item.status === "concealed" ? "text-gray-500" : null
          }`}
        >
          <Suspense fallback="">
            <Price item={item} />
          </Suspense>
        </div>
        <ControlCell className="item-controlArea">
          <ButtonCompo
            fontSize="0.6rem"
            disabled={item.status === "concealed"}
            color={Color.JPRed}
            onClick={handleConcealOnClick}
          >
            {t("conceal")}
          </ButtonCompo>
        </ControlCell>
      </div>
      <div className="flex lg:hidden relative justify-around  w-full rounded-[10px] p-2 transition duration-500 hover:bg-mainLight ">
        <CustomImage width={80} itemCode={itemCode} colorNo={parseInt(color)} />
        <div className="flex flex-col gap-1 justify-between w-full">
          <div className="absolute top-0 left-0 text-jpRed font-bold">
            {item.rate !== 1 ? stringifyOrderItemRate(item.rate) : null}
          </div>
          <div className="flex justify-center gap-2">
            <div className="flex gap-1 justify-center">
              <div
                className="cursor-pointer flex justify-center items-center"
                onClick={clickToCopyToClipboard}
              >
                {itemCode}
              </div>
              <div className="flex items-center justify-center">
                {size !== "9" ? `${size})` : null}
                <ColorCell>{color}</ColorCell>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {t(`location.${item.location}`, { ns: "inventory" })}
            </div>
          </div>
          <div className="flex items-center justify-center text-lg">
            <StatusWrapper status={item.status}>
              {t(item?.status!, { ns: "orderStatus" })}
            </StatusWrapper>
          </div>
          <ControlCell className="item-controlArea w-full justify-end">
            <ButtonCompo
              fontSize="0.6rem"
              disabled={item.status === "concealed"}
              color={Color.JPRed}
              onClick={handleConcealOnClick}
            >
              {t("conceal")}
            </ButtonCompo>
          </ControlCell>
        </div>
      </div>
    </>
  );
};

const InfoCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ControlCell = styled.div`
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
`;

interface StatusWrapperProps {
  status: OrderItemStatus;
}

const StatusWrapper = styled(InfoCell)<StatusWrapperProps>`
  color: ${(props) => {
    switch (props.status) {
      case "backordering":
        return Color.JPRed;
      case "guaranteed":
        return Color.MAIN;
      case "shipped":
        return Color.Success;
      case "concealed":
        return "gray";
    }
  }};
`;

const ColorCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 20px;
  width: 20px;
  border: 1px solid;
  border-radius: 50%;
`;
