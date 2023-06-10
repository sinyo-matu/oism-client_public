import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../../lib/utility";
import { colorNoAtom } from "../../../../store/newOrder";
import { PhItem } from "../../../../type";
import { CustomImage } from "../../../Image";
import { InfoCell } from "./InfoCell";
import { InStockInfoCell } from "./InStockInfoCell";
import { SizeAndColor } from "./SizeAndColor";
import { SubmitButton } from "./SubmitButton";

export const ItemInfo = ({ item }: { item: PhItem }) => {
  const [colorNo] = useAtom(colorNoAtom);
  return (
    <Wrapper>
      <CustomImage
        width={200}
        itemCode={item.code}
        colorNo={parseInt(colorNo)}
      />
      <InfoAreaWrapper>
        <DoubleColCell>
          <InfoCell label="アイテム名:" content={item.itemName!} />
        </DoubleColCell>
        <DoubleColCell>
          <InfoCell label="アイテムコード:" content={item.code} />
        </DoubleColCell>
        <InfoCell
          label="価格(税抜き):"
          content={convertToJPYCurrencyFormatString(
            convertWithTaxPriceToWithOutTaxPrice(item.price)
          )}
        />
        <InfoCell label="製造地:" content={item.madeIn!} />
        <DoubleColCell>
          <InStockInfoCell />
        </DoubleColCell>
        <DoubleColCell>
          <SizeAndColor item={item} />
        </DoubleColCell>
      </InfoAreaWrapper>
      <ControlAreaWrapper>
        <SubmitButton item={item} />
      </ControlAreaWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  grid-area: info;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  border-radius: 15px;
`;

const DoubleColCell = styled.div`
  grid-column: 1/3;
`;

const InfoAreaWrapper = styled.div`
  box-sizing: border-box;
  padding: 0 10px;
  flex-grow: 1;
  gap: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
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
