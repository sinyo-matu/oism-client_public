import { useAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../lib/utility";
import {
  currentItemAtom,
  currentItemDetailAtom,
  increaseItemListAtom,
  itemAtom,
  itemDetailAtom,
  previousItemAtom,
  previousItemDetailAtom,
} from "../../../store/StockRegister";
import { ButtonCompo } from "../../ButtonCompo";
import { InfoCell } from "./InfoCell";
import { CustomImage } from "../../Image";
import { useSetAtom } from "jotai";
import useSound from "../../../lib/hooks/useSound";

export const AutoDetect = () => {
  const [currentItem] = useAtom(currentItemAtom);
  const [currentItemDetail] = useAtom(currentItemDetailAtom);
  const setPreviousItem = useSetAtom(previousItemAtom);
  const setPreviousItemDetail = useSetAtom(previousItemDetailAtom);
  const [playOk] = useSound({ toPlay: "ok" });
  const [playOk2] = useSound({ toPlay: "ok2" });
  const [item] = useAtom(itemAtom);
  const [itemDetail] = useAtom(itemDetailAtom);
  const [stockItemList, increaseRegisterItemsList] =
    useAtom(increaseItemListAtom);

  const handleRegisterOnClick = async (
    _e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setPreviousItem(currentItem);
    setPreviousItemDetail(currentItemDetail);
    if (currentItem && currentItemDetail) {
      playOk();
      increaseRegisterItemsList({
        itemCodeExt: `${currentItem.code}${currentItemDetail.size}${currentItemDetail.color}`,
        itemName: currentItem.itemName ?? "",
        count: 1,
        price: currentItem.price,
        isManual: false,
      });
    }
  };

  const increaseRef = useRef<typeof increaseRegisterItemsList>();
  increaseRef.current = increaseRegisterItemsList;

  const stockItemListRef = useRef<typeof stockItemList>();
  stockItemListRef.current = stockItemList;

  const setPreviousItemRef = useRef<typeof setPreviousItem>();
  setPreviousItemRef.current = setPreviousItem;
  const setPreviousItemDetailRef = useRef<typeof setPreviousItemDetail>();
  setPreviousItemDetailRef.current = setPreviousItemDetail;

  const playOkRef = useRef(playOk);
  const playOk2Ref = useRef(playOk2);

  useEffect(() => {
    const addItemToList = async () => {
      if (currentItem && currentItemDetail && increaseRef.current) {
        setPreviousItemRef.current!(currentItem);
        setPreviousItemDetailRef.current!(currentItemDetail);
        playOkRef.current();
        increaseRef.current({
          itemCodeExt: `${currentItem.code}${currentItemDetail.size}${currentItemDetail.color}`,
          itemName: currentItem.itemName ?? "",
          count: 1,
          price:
            currentItem.price !== 0
              ? currentItem.price
              : currentItemDetail.price,
          isManual: currentItem.price === 0,
        });
        const input = document.getElementById("codeInput");
        input?.focus();
      }
    };
    addItemToList();
  }, [currentItem, currentItemDetail]);

  useEffect(() => {
    if (currentItem) {
      playOk2Ref.current();
    }
  }, [currentItem]);

  if (!item) {
    return (
      <>
        <PlaceHolderWrapper>
          アイテムが見つかりませんでした。
        </PlaceHolderWrapper>
        <ControlAreaWrapper>
          <ButtonCompo fontSize="1rem" onClick={handleRegisterOnClick}>
            納品一覧に登録
          </ButtonCompo>
        </ControlAreaWrapper>
      </>
    );
  }

  return (
    <>
      <ImageWrapper>
        <CustomImage
          width={180}
          colorNo={itemDetail?.color ?? 3}
          itemCode={item.code}
        />
      </ImageWrapper>
      <InfoAreaWrapper>
        <DoubleColCell>
          <InfoCell label="アイテム名:" content={item.itemName!} />
        </DoubleColCell>
        <DoubleColCell>
          <InfoCell label="アイテムコード:" content={item.code} />
        </DoubleColCell>
        <InfoCell
          label="価格(税抜き):"
          content={
            item.price !== 0
              ? convertToJPYCurrencyFormatString(
                  convertWithTaxPriceToWithOutTaxPrice(item.price)
                )
              : currentItemDetail
              ? convertToJPYCurrencyFormatString(
                  convertWithTaxPriceToWithOutTaxPrice(currentItemDetail.price)
                )
              : "入力待ち"
          }
        />
        <InfoCell label="製造地:" content={item.madeIn!} />
        <InfoCell
          label="サイズ番:"
          content={`${itemDetail ? itemDetail.size : "入力待ち"}`}
        />
        <InfoCell
          label="色番:"
          content={`${itemDetail ? itemDetail.color : "入力待ち"}`}
        />
      </InfoAreaWrapper>
    </>
  );
};

const DoubleColCell = styled.div`
  grid-column: 1/3;
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoAreaWrapper = styled.div`
  box-sizing: border-box;
  padding: 0 10px;
  flex-grow: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
`;

const PlaceHolderWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ControlAreaWrapper = styled.div`
  box-sizing: border-box;
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
`;
