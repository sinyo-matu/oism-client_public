import { useAtom } from "jotai";
import React, { useState } from "react";
import styled from "styled-components";
import { clearItemListAtom } from "../../store/StockRegister";
import { ButtonCompo } from "../ButtonCompo";
import { RegisterItem, StockRegisterInput } from "../../type";
import { toast } from "react-toastify";
import Input from "../../styles/atoms/Input";
import { Color } from "../../styles/Color";
import { registersAtomSignal } from "../../store/registerList";
import { inventoryItemSignal } from "../../store/inventory";
import { itemIsInStockSignalAtom } from "../../store/newOrder";
import { ordersAtomSignal } from "../../store/orderList";
import { shipmentItemSuggestionSignalAtom } from "../../store/newShipment";
import { isLoadingModalOpen } from "../../store";
import { returnInventorySuggestionSignalAtom } from "../../store/newReturn";
import { privateApiCall } from "../../lib/utility";
import dayjs from "dayjs";
import { AppError } from "../../type/error";
import { useTranslation } from "next-i18next";

export const ControlBar = () => {
  const { t } = useTranslation(["message"]);
  const now = new Date();
  const [arrivalYear, setArrivalYear] = useState(`${now.getFullYear()}`);
  const [arrivalMonth, setArrivalMonth] = useState(`${now.getMonth() + 1}`);
  const [arrivalDay, setArrivalDay] = useState(`${now.getDate()}`);
  const [stockItemList, clearStockItemList] = useAtom(clearItemListAtom);
  const [arrivalDateIsError, setArrivalDateIsError] = useState(false);
  const [inventorySignal, sendInventorySignal] = useAtom(inventoryItemSignal);
  const [registerSignal, sendRegisterSignal] = useAtom(registersAtomSignal);
  const [isInStockSignal, sendIsInStockSignal] = useAtom(
    itemIsInStockSignalAtom
  );
  const [orderListSignal, sendOrderListSignal] = useAtom(ordersAtomSignal);
  const [shipmentSignal, sendShipmentSignal] = useAtom(
    shipmentItemSuggestionSignalAtom
  );
  const [returnSuggestionsSignal, sendReturnSuggestionsSignal] = useAtom(
    returnInventorySuggestionSignalAtom
  );
  const [loading, setLoading] = useAtom(isLoadingModalOpen);
  const handleRegisterNoInputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "year":
        setArrivalYear(value);
        break;
      case "month":
        setArrivalMonth(value);
        break;
      case "day":
        setArrivalDay(value);
        break;
    }
  };

  const handleRegisterOnClick = async () => {
    if (stockItemList.size === 0) {
      toast.warn("商品が登録さていません");
      return;
    }
    if (
      arrivalYear.length === 0 ||
      arrivalMonth.length === 0 ||
      arrivalDay.length === 0
    ) {
      setArrivalDateIsError(true);
      setTimeout(() => setArrivalDateIsError(false), 1000);
      toast.error("納品日付を入れてください");
      return;
    }
    setLoading(true);
    const items: RegisterItem[] = Array.from(stockItemList).map(
      ([key, item]) => ({
        itemCodeExt: item.itemCodeExt,
        count: item.count,
        price: Math.round(item.price!),
        isManual: item.isManual!,
      })
    );
    const arrivalDate = dayjs(
      `${arrivalYear}/${arrivalMonth}/${arrivalDay} ${now.getHours()}:${now.getMinutes()}`
    ).unix();
    const register: StockRegisterInput = {
      arrivalDate,
      no: "1",
      items,
    };
    try {
      await privateApiCall("/registers", "POST", JSON.stringify(register));
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
          toast.error("納品作成が失敗しました");
      }
      console.log(err);
      setLoading(false);
      return;
    }
    toast.success(
      `納品${arrivalYear}/${arrivalMonth}/${arrivalDay}登録できました。`
    );
    sendInventorySignal(inventorySignal + 1);
    sendRegisterSignal(registerSignal + 1);
    sendIsInStockSignal(isInStockSignal + 1);
    clearStockItemList();
    let check_message = {
      items,
    };
    const check_res = await privateApiCall<string[]>(
      "/orders/check_then_update",
      "PUT",
      JSON.stringify(check_message)
    );
    if (check_res) {
      sendInventorySignal(inventorySignal + 1);
      sendIsInStockSignal(isInStockSignal + 1);
      sendOrderListSignal(orderListSignal + 1);
      clearStockItemList();
      sendShipmentSignal(shipmentSignal + 1);
      sendReturnSuggestionsSignal(returnSuggestionsSignal + 1);
      check_res.forEach(
        (customerId) =>
          toast.success(`${customerId}さんの注文が確保されました`),
        {
          autoClose: 10000,
        }
      );
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <StockRegisterInfoWrapper>
        <ArrivalDateInputWrapper>
          <ArrivalDateInput
            isError={arrivalDateIsError}
            name="year"
            placeholder="納品年"
            value={arrivalYear}
            onChange={handleRegisterNoInputOnChange}
          />
          <ArrivalDateInput
            name="month"
            isError={arrivalDateIsError}
            placeholder="納品月"
            value={arrivalMonth}
            onChange={handleRegisterNoInputOnChange}
          />
          <ArrivalDateInput
            name="day"
            isError={arrivalDateIsError}
            placeholder="納品日"
            value={arrivalDay}
            onChange={handleRegisterNoInputOnChange}
          />
        </ArrivalDateInputWrapper>
      </StockRegisterInfoWrapper>
      <RegisterButtonWrapper>
        <ButtonCompo
          onClick={handleRegisterOnClick}
          fontSize="2rem"
          disabled={loading}
        >
          納品登録
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

const ArrivalDateInput = styled(Input)<InputProps>`
  font-size: 1rem;
  width: 80px;
  ${(props) =>
    props.isError
      ? `box-shadow: 0 0 0.3em ${Color.Error};border-color:${Color.Error}`
      : null};
`;

const StockRegisterInfoWrapper = styled.div`
  flex-grow: 1;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
`;

const ArrivalDateInputWrapper = styled.div`
  gap: 5px;
  flex-grow: 1;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: centerSignal;
  justify-content: flex-start;
`;

const RegisterButtonWrapper = styled.div`
  display: flex;
  height: 100%;
  min-width: 100px;
  align-items: center;
  justify-content: center;
`;
