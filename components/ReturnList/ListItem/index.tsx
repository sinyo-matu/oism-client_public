import { useTranslation } from "next-i18next";
import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { stringifyDateDataToDate } from "../../../lib/utility";
import { phItemCacheAtom } from "../../../store/returnList";
import { Color } from "../../../styles/Color";
import { Return } from "../../../type/return";
import { TotalPrice } from "../../CountableItemTotalPrice";
import { ControlPanel } from "./ControlPanel";
import { StockHeader } from "./StockHeader";
import { StockItem } from "./StockItem";

export const ListItem = ({ fromParent }: { fromParent: Return }) => {
  const { t } = useTranslation();
  const [retrn, setItem] = useState<Return | undefined>(undefined);
  useEffect(() => {
    setItem(fromParent);
  }, [fromParent]);
  if (!retrn)
    return <div>{t("pattern.cantFindCertainItem", { name: t("return") })}</div>;
  const item_q = retrn.items.reduce((acc, item) => acc + item.count, 0);
  return (
    <Wrapper>
      <MetaWrapper>
        <div>{stringifyDateDataToDate(retrn.returnDate)}</div>
        <NoWrapper>{retrn.returnNo}</NoWrapper>
        <NoWrapper>{item_q}点</NoWrapper>
        <NoWrapper>
          <Suspense fallback="">
            <TotalPrice
              withCountableItems={retrn}
              phItemCacheAtom={phItemCacheAtom}
            />
          </Suspense>
        </NoWrapper>
      </MetaWrapper>
      <StockList>
        <StockHeader />
        <ItemWrapper>
          {retrn.items
            .sort((a, b) => a.itemCodeExt.localeCompare(b.itemCodeExt))
            .map((ope) => {
              return <StockItem key={ope.itemCodeExt} item={ope} />;
            })}
        </ItemWrapper>
      </StockList>
      <ControlPanel item={retrn} />
    </Wrapper>
  );
};

const borderWidth = 2;

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  border: ${borderWidth}px solid transparent;
  background: #fff;
  background-clip: padding-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  height: 100%;
  border-radius: 15px;
  box-shadow: 0px 0px 7px -5px ${Color.Black};
  transition: 0.5s;
  &:hover .controlPanel {
    opacity: 1;
  }
  &:hover {
    box-shadow: 0 0 7px -3px ${Color.Black};
  }
`;

const MetaWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const NoWrapper = styled.div`
  box-sizing: border-box;
  text-align: center;
  background-color: ${Color.Default};
  border: 1px solid ${Color.SUB};
  color: ${Color.SUB};
  border-radius: 999px;
  padding: 0px 7px;
`;

const StockList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  gap: 3px;
  padding: 5px;
  flex-grow: 1;
`;

const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  gap: 3px;
  height: 150px;
  overflow-y: auto;
  overflow-x: hidden;
`;
