import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { Suspense, useState } from "react";
import styled from "styled-components";
import { ORDERITEM_STATUS, repSearch } from "../../../lib/utility";
import {
  fromDateAtom,
  queryKeywordAtom,
  ToDateAtom,
} from "../../../store/orderList";
import InputBase from "../../../styles/atoms/Input";
import { StatusButton } from "./StatusButton";
import { TotalCount } from "./TotalCount";
import { TotalCountPlaceHolder } from "./TotalCountPlaceHolder";

export const ListViewControlArea = () => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useAtom(queryKeywordAtom);
  const [keywordValue, setKeywordValue] = useState(keyword);
  const [fromDate, setFromDate] = useAtom(fromDateAtom);
  const [toDate, setToDate] = useAtom(ToDateAtom);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = repSearch(e.target.value);
    setKeywordValue(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setKeyword(value), 500));
  };
  return (
    <>
      <div className="hidden lg:flex lg:max-w-7xl justify-center z-10 items-center gap-2 w-full py-2 top-[56px] sticky bg-white box-border">
        <InputBase
          value={keywordValue}
          onChange={handleInputOnChange}
          placeholder={t("order") + t("search")}
          className="p-2 text-md"
        />
        <Suspense fallback={<TotalCountPlaceHolder />}>
          <TotalCount />
        </Suspense>
        <RightWrapper>
          <ButtonWrapper>
            {ORDERITEM_STATUS.map((status) => (
              <StatusButton key={status} status={status} />
            ))}
          </ButtonWrapper>
          <InputBase
            type="date"
            value={fromDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setFromDate(value);
            }}
          />
          ~
          <InputBase
            type="date"
            value={toDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setToDate(value);
            }}
          />
        </RightWrapper>
      </div>
      <div className=" flex lg:hidden flex-col items-center content-center p-2  gap-4 top-[56px] z-10 w-full sticky bg-white ">
        <div className="flex items-center justify-between w-full">
          <InputBase
            value={keywordValue}
            onChange={handleInputOnChange}
            placeholder="注文検索..."
            className="p-2 text-sm"
          />
          <Suspense fallback={<TotalCountPlaceHolder />}>
            <TotalCount />
          </Suspense>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex item-center content-start gap-2 py-1">
            {ORDERITEM_STATUS.map((status) => (
              <StatusButton key={status} status={status} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <InputBase
            type="date"
            value={fromDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setFromDate(value);
            }}
            className="text-sm"
          />
          ~
          <InputBase
            type="date"
            value={toDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setToDate(value);
            }}
            className="text-sm"
          />
        </div>
      </div>
    </>
  );
};

const Input = styled(InputBase)`
  box-sizing: border-box;
  padding: 9px;
  font-size: 1rem;
`;

const RightWrapper = styled.div`
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const ButtonWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  height: 100%;
`;
