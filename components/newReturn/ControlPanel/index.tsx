import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { privateApiCall } from "../../../lib/utility";
import { isLoadingModalOpen } from "../../../store";
import { inventoryItemSignal } from "../../../store/inventory";
import {
  clearItemListAtom,
  returnInventorySuggestionSignalAtom,
} from "../../../store/newReturn";
import { ordersAtomSignal } from "../../../store/orderList";
import { returnsAtomSignal } from "../../../store/returnList";
import Input from "../../../styles/atoms/Input";
import { Color } from "../../../styles/Color";
import { AppError } from "../../../type/error";
import { NewReturnInput } from "../../../type/return";
import { ButtonCompo } from "../../ButtonCompo";

export const ControlPanel = () => {
  const { t } = useTranslation(["common", "message", "shipments"]);
  const [returnItemsList, clearReturnItemsList] = useAtom(clearItemListAtom);
  const [returnNo, setShipmentNo] = useState("");
  const [shipmentNoIsError, setShipmentNoIsError] = useState(false);
  const [returnDate, setShipDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [note, setNote] = useState("");
  const [inventorySignal, sendInventorySignal] = useAtom(inventoryItemSignal);
  const [orderListSignal, sendOrderListSignal] = useAtom(ordersAtomSignal);
  const [returnSuggestionSignal, sendReturnSuggestionSignal] = useAtom(
    returnInventorySuggestionSignalAtom
  );
  const [returnListSignal, sendReturnListSignal] = useAtom(returnsAtomSignal);
  const [loading, setLoading] = useAtom(isLoadingModalOpen);
  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "returnNo":
        setShipmentNo(value);
        break;
      case "note":
        setNote(value);
        break;
      case "returnDate":
        setShipDate(e.target.value);
        break;
    }
  };

  const handleSubmitOnClick = async () => {
    if (returnItemsList.size === 0) {
      toast.warn("返品が登録されていません");
      return;
    }
    if (returnNo === "") {
      setShipmentNoIsError(true);
      setTimeout(() => setShipmentNoIsError(false), 1000);
      toast.error("返品番号が入力されていません");
      return;
    }
    setLoading(true);
    const input: NewReturnInput = {
      returnNo: returnNo.trim(),
      note,
      items: Array.from(returnItemsList).map(([, [item]]) => ({
        itemCodeExt: item.itemCodeExt,
        quantity: item.quantity,
      })),
      returnDate: dayjs(returnDate).unix(),
    };
    try {
      await privateApiCall("/return", "POST", JSON.stringify(input));
    } catch (err) {
      switch (err) {
        case AppError.PermissionNotEnough:
          toast.error(
            t("common.error.permissionNotEnough", {
              ns: "message",
            })
          );
          break;
        default:
          toast.error("返品が失敗しました");
      }
      console.log(err);
      setLoading(false);
      return;
    }
    setLoading(false);
    setShipmentNo("");
    setNote("");
    clearReturnItemsList();
    sendInventorySignal(inventorySignal + 1);
    sendOrderListSignal(orderListSignal + 1);
    sendReturnSuggestionSignal(returnSuggestionSignal + 1);
    sendReturnListSignal(returnListSignal + 1);
    toast.success("返品を作成しました");
  };

  return (
    <Wrapper>
      <InputAreaWrapper>
        <VendorInfo>
          <TaobaoOrderNoInput
            isError={shipmentNoIsError}
            name="returnNo"
            placeholder="返品番号"
            value={returnNo}
            onChange={handleInputValueChange}
          />
        </VendorInfo>
        <OtherInfoWrapper>
          <Input
            type="date"
            name="returnDate"
            className=" text-sm"
            value={returnDate}
            onChange={handleInputValueChange}
          />
          <NoteInput
            isError={false}
            name="note"
            placeholder="備考"
            value={note}
            onChange={handleInputValueChange}
          />
        </OtherInfoWrapper>
      </InputAreaWrapper>
      <RegisterButtonWrapper>
        <ButtonCompo
          onClick={handleSubmitOnClick}
          fontSize="2rem"
          disabled={loading}
        >
          返品登録
        </ButtonCompo>
      </RegisterButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  box-sizing: border-box;
  grid-area: ctl;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

interface InputProps {
  isError: boolean;
}

const VendorInfo = styled.div`
  gap: 5px;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const TaobaoOrderNoInput = styled(Input)<InputProps>`
  font-size: 1.3rem;
  ${(props) =>
    props.isError
      ? `box-shadow: 0 0 0.3em ${Color.Error};border-color:${Color.Error}`
      : null};
`;

const OtherInfoInput = styled(Input)<InputProps>`
  font-size: 1rem;
  width: 120px;
  ${(props) =>
    props.isError
      ? `box-shadow: 0 0 0.3em ${Color.Error};border-color:${Color.Error}`
      : null};
`;

const NoteInput = styled(OtherInfoInput)`
  width: 300px;
`;

const InputAreaWrapper = styled.div`
  flex-grow: 1;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
`;

const OtherInfoWrapper = styled.div`
  gap: 5px;
  flex-grow: 1;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const RegisterButtonWrapper = styled.div`
  display: flex;
  height: 100%;
  min-width: 100px;
  align-items: center;
  justify-content: center;
`;
