import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import {
  fromDateAtom,
  queryKeywordAtom,
  ToDateAtom,
} from "../../store/transferList";
import InputBase from "../../styles/atoms/Input";
import { SearchKeywordInput } from "../SearchKeywordInput";
export const ListViewControlArea = () => {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useAtom(fromDateAtom);
  const [toDate, setToDate] = useAtom(ToDateAtom);

  return (
    <div className="flex flex-col lg:flex-row lg:max-w-7xl justify-center lg:justify-end z-10 items-center gap-2 w-full p-2 top-[56px] sticky bg-white box-border">
      <div className="flex items-center justify-between w-full">
        <SearchKeywordInput
          placeholder={t("transfer") + t("search")}
          keywordAtom={queryKeywordAtom}
        />
      </div>
      <div className="flex gap-1 items-center justify-between w-full lg:w-fit ">
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
      </div>
    </div>
  );
};

const Wrapper = styled.div`
  position: sticky;
  top: 50px;
  z-index: 1;
  background-color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  height: 50px;
  width: 100%;
`;

const RightWrapper = styled.div`
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;
