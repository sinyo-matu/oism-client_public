import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { Suspense } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { GetHighlightedText } from "../../../../lib/helpComponents";
import {
  clickToCopyToClipboard,
  myCopyImageToClipboard,
  parseItemCode,
  stringifyDateDataToMonthDay,
  stringifyOrderItemRate,
} from "../../../../lib/utility";
import { queryKeywordAtom } from "../../../../store/shipmentList";
import { customBounce } from "../../../../styles/animation";
import { Color } from "../../../../styles/Color";
import { OrderItem } from "../../../../type/order";
import { CustomImage } from "../../../Image";
import { Price } from "./Price";
export const Item = ({ item, index }: { item: OrderItem; index: number }) => {
  const { t } = useTranslation("orderStatus");
  const [itemCode, size, color] = parseItemCode(item.itemCodeExt);
  const searchString = useAtomValue(queryKeywordAtom);
  const handleImageOnClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    try {
      await myCopyImageToClipboard(`${itemCode}_${color}.jpeg`);
    } catch (err) {
      toast.error("コピーが失敗しました");
      return;
    }
    toast.success("コピーしました", {
      position: toast.POSITION.BOTTOM_CENTER,
      transition: customBounce,
    });
  };
  return (
    <>
      <div className="hidden lg:grid grid-cols-5 relative justify-around flex-wrap w-full rounded-[10px] p-[2px] transition duration-500 hover:bg-mainLight">
        <div className="absolute top-[50%] translate-y-[-50%] left-2 text-sub">
          {index + 1}
        </div>
        <CustomImage
          width={25}
          itemCode={itemCode}
          colorNo={parseInt(color)}
          onClick={handleImageOnClick}
        />
        <div className="absolute top-[50%] translate-y-[-50%] left-4 text-jpRed font-bold">
          {item.rate !== 1 ? stringifyOrderItemRate(item.rate) : null}
        </div>
        <div className="flex items-center justify-center">
          {stringifyDateDataToMonthDay(item.orderDatetime)}
        </div>
        <ItemCodeCell onClick={clickToCopyToClipboard}>
          <GetHighlightedText text={item.customerId} highlight={searchString} />
        </ItemCodeCell>
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
          {item.status !== "concealed" ? (
            <Suspense fallback="">
              <Price item={item} />
            </Suspense>
          ) : (
            <ConcealedStatusCell>{t(item.status)}</ConcealedStatusCell>
          )}
        </div>
      </div>

      <div className="flex lg:hidden relative justify-around gap-2  w-full rounded-[10px] p-2 transition duration-500 hover:bg-mainLight ">
        <CustomImage width={80} itemCode={itemCode} colorNo={parseInt(color)} />
        <div className="flex flex-col gap-1 justify-between w-full">
          <div className="absolute top-0 left-0 text-jpRed font-bold">
            {item.rate !== 1 ? stringifyOrderItemRate(item.rate) : null}
          </div>
          <div className="flex justify-between gap-2">
            <ItemCodeCell onClick={clickToCopyToClipboard}>
              <GetHighlightedText
                text={item.customerId}
                highlight={searchString}
              />
            </ItemCodeCell>
            <div className="flex items-center justify-center">
              {stringifyDateDataToMonthDay(item.orderDatetime)}
            </div>
          </div>
          <div className="flex justify-end gap-2">
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

          <div className="flex items-center justify-end">
            {item.status !== "concealed" ? (
              <Suspense fallback="">
                <Price item={item} />
              </Suspense>
            ) : (
              <ConcealedStatusCell>{t(item.status)}</ConcealedStatusCell>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Wrapper = styled.div`
  cursor: default;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 10% 10% 20% 20% 20% 20%;
  padding: 2px 0px;
  width: 100%;
  gap: 5px;
  border-radius: 10px;
  transition: 500ms;
  &:hover {
    background-color: ${Color.MAINLight};
  }
`;

const InfoCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemCodeCell = styled(InfoCell)`
  cursor: pointer;
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

const ConcealedStatusCell = styled(InfoCell)`
  color: gray;
`;
