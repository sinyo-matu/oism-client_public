import { useAtom } from "jotai";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  parseItemCode,
  privateApiCall,
  stringifyOrderItemRate,
} from "../../lib/utility";
import {
  orderItemForUpdateAtom,
  updateRateOpenAtom,
} from "../../store/orderList";
import { CustomImage } from "../Image";
import { ConfirmModal } from "../ConfirmModal";
import Input from "../../styles/atoms/Input";
import { useTranslation } from "next-i18next";

export const UpdateOrderItemRateModal = () => {
  const { t } = useTranslation(["message", "common"]);
  const [isOpen, setIsOpen] = useAtom(updateRateOpenAtom);
  const [item] = useAtom(orderItemForUpdateAtom);
  const [itemCode, , color] = parseItemCode(item?.itemCodeExt);
  const [loading, setLoading] = useState(false);
  const [rateInputValue, setRateInputValue] = useState("");
  const [rate, setRate] = useState(item?.rate);
  const closeModal = () => {
    setRateInputValue("");
    setIsOpen(false);
  };

  const handleRateInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setRateInputValue(value);
    if (value === "") {
      value = "0";
    }
    let parsed = parseInt(value);
    if (isNaN(parsed)) {
      return;
    }
    if (parsed > 100 || parsed < 0) return;
    setRate((100 - parsed) / 100.0);
  };
  const onConfirmClicked = async () => {
    if (rate === item.rate) {
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      await privateApiCall(
        `/order_items/${item!.id}/rate`,
        "PATCH",
        JSON.stringify({ rate })
      );
    } catch (err) {
      console.log(err);
      setLoading(false);
      setIsOpen(false);
      switch (err) {
        default:
          toast.error(t("common.error.changeFailed") + err);
          return;
      }
    }
    setLoading(false);
    setIsOpen(false);
    toast.success(t("common.success.beenChanged", { value: item.itemCodeExt }));
  };
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      loading={loading}
      onConfirmClicked={onConfirmClicked}
      infoContent={
        <>
          <div>
            {item?.customerId}
            {t("deorno", { ns: "common" })}
          </div>
          <div>{item?.itemCodeExt.slice(0, 11)}</div>
        </>
      }
      mainContent={
        <div className=" flex flex-col gap-2">
          <div className=" relative">
            <div className="absolute top-0 left-0 text-jpRed font-bold">
              {item?.rate !== 1 ? stringifyOrderItemRate(item?.rate) : null}
            </div>
            <CustomImage
              width={100}
              itemCode={itemCode}
              colorNo={parseInt(color)}
            />
          </div>
          <div>
            <RateInput
              type="number"
              step={5}
              value={rateInputValue}
              onChange={handleRateInputOnChange}
            />
            <span className="text-[2.5rem]">%Off</span>
          </div>
        </div>
      }
      title={t("discount", { ns: "common" }) + t("change", { ns: "common" })}
    />
  );
};

const RateInput = styled(Input)`
  font-size: 2.5rem;
  width: 100px;
`;
