import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { repSearch, SHIPMENT_STATUSES } from "../../../lib/utility";
import {
  exportByIdsModalOpenAtom,
  fromDateAtom,
  queryKeywordAtom,
  shipmentStatusAtom,
  shipmentVendorAtom,
  phItemCacheAtom,
  shipmentsAtom,
  ToDateAtom,
} from "../../../store/shipmentList";
import InputBase from "../../../styles/atoms/Input";
import { Color } from "../../../styles/Color";
import { ButtonCompo } from "../../ButtonCompo";
import { RadioButton } from "../../RadioButton";
import { TotalPrice } from "../../TotalPrice";
import { ACHIEVED_VENDORS, vendors } from "../../../type/shipment";
export const ListViewControlArea = () => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useAtom(queryKeywordAtom);
  const [keywordValue, setKeywordValue] = useState(keyword);
  const [fromDate, setFromDate] = useAtom(fromDateAtom);
  const [toDate, setToDate] = useAtom(ToDateAtom);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [status, setStatus] = useAtom(shipmentStatusAtom);
  const [vendor, setVendor] = useAtom(shipmentVendorAtom);
  const setExportModalOpen = useSetAtom(exportByIdsModalOpenAtom);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = repSearch(e.target.value);
    setKeywordValue(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setKeyword(value), 500));
  };

  const setKeywordRef = useRef<typeof setKeyword>(setKeyword);
  const setKeywordValueRef = useRef<typeof setKeywordValue>(setKeywordValue);

  useEffect(() => {
    setKeywordRef.current("");
    setKeywordValueRef.current("");
  }, []);

  return (
    <>
      <div className=" flex-col flex lg:flex-row z-10 items-center justify-between lg:items-end content-center  gap-2 w-full p-2 top-[56px] sticky bg-white box-border">
        <div className="flex items-center justify-between gap-1 w-full lg:w-auto">
          <Input
            value={keywordValue}
            onChange={handleInputOnChange}
            placeholder={`${t("shipment")}${t("search")}`}
          />
          <Suspense fallback={<div>{t("totalAmount")}:￥</div>}>
            <TotalPrice cacheAtom={phItemCacheAtom} itemsAtom={shipmentsAtom} />
          </Suspense>
        </div>
        <div className=" flex flex-col lg:flex-row w-full lg:w-auto items-center justify-between lg:items-end content-center gap-2">
          <div className="flex flex-col lg:flex-row items-start gap-1 justify-between w-full lg:w-auto ">
            <RadioButton
              members={vendors.filter((v) => !ACHIEVED_VENDORS.includes(v))}
              state={vendor}
              setAction={setVendor}
              color={Color.SUB}
              nullable
              ns="shipments"
              keyPrefix="vendor"
            />
            <div className="flex items-center gap-1 justify-between w-full lg:w-auto">
              <RadioButton
                members={SHIPMENT_STATUSES}
                state={status}
                setAction={setStatus}
                color={Color.MAIN}
                ns="shipments"
                nullable
                keyPrefix="status"
              />
              <ButtonCompo
                fontSize="0.9rem"
                color={Color.Success}
                onClick={() => setExportModalOpen(true)}
              >
                {t("export")}
              </ButtonCompo>
            </div>
          </div>

          <div className="flex items-center justify-between w-full lg:w-auto">
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
      </div>
    </>
  );
};

const Input = styled(InputBase)`
  box-sizing: border-box;
  padding: 9px;
  font-size: 1rem;
`;
