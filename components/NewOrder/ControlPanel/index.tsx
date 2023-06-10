import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useAtom, useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { isValidTaobaoOrderNo, privateApiCall } from "../../../lib/utility";
import { isLoadingModalOpen } from "../../../store";
import { inventoryItemSignal } from "../../../store/inventory";
import {
  clearItemListAtom,
  itemCodeAtom,
  itemIsInStockSignalAtom,
  orderDatetimeAtom,
  orderItemListAtom,
  orderNoteAtom,
} from "../../../store/newOrder";
import { shipmentItemSuggestionSignalAtom } from "../../../store/newShipment";
import { ordersAtomSignal } from "../../../store/orderList";
import Input from "../../../styles/atoms/Input";
import { Color } from "../../../styles/Color";
import { InputOrderItem, Order, OrderRegisterInput } from "../../../type/order";
import { ButtonCompo } from "../../ButtonCompo";
import { useTranslation } from "next-i18next";
import { AppError } from "../../../type/error";

dayjs.extend(utc);
dayjs.extend(timezone);

export const ControlPanel = () => {
  const { t } = useTranslation("order");
  const [taobaoOrderNo, setTaobaoOrderNo] = useState("");
  const [taobaoOrderNoIsError, setTaobaoOrderNoIsError] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [customerIdIsError, setCustomerIdIsError] = useState(false);
  const [orderDatetime, setOrderDatetime] = useAtom(orderDatetimeAtom);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [note, setNote] = useAtom(orderNoteAtom);
  const orderItemMap = useAtomValue(orderItemListAtom);
  const clearItemMap = useSetAtom(clearItemListAtom);
  const setItemCode = useSetAtom(itemCodeAtom);
  const [inventorySignal, sendInventorySignal] = useAtom(inventoryItemSignal);
  const [orderListSignal, sendOrderListSignal] = useAtom(ordersAtomSignal);
  const [shipmentSignal, sendShipmentSignal] = useAtom(
    shipmentItemSuggestionSignalAtom
  );
  const [isInStockSignal, sendIsInStockSignal] = useAtom(
    itemIsInStockSignalAtom
  );
  const [loading, setLoading] = useAtom(isLoadingModalOpen);
  const [existedOrderByTaobaoNo, setExistedOrderByTaobaoNo] = useState<Order[]>(
    []
  );
  const orderItemList = Array.from(orderItemMap);

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "customerId":
        setCustomerId(value);
        break;
      case "note":
        setNote(value);
        break;
      case "orderDatetime":
        setOrderDatetime(dayjs(e.target.value).utc());
        break;
      case "taobaoOrderNo":
        setTaobaoOrderNo(e.target.value);
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(
          setTimeout(async () => {
            if (e.target.value.length === 0) return;
            if (!isValidTaobaoOrderNo(e.target.value)) {
              toast.warn("取引番号に間違いがあります");
              setTaobaoOrderNo("");
              return;
            }
          }, 500)
        );
        break;
    }
  };

  useEffect(() => {
    const loadExistedOrderByTaobaoNo = async () => {
      if (taobaoOrderNo.length <= 2) setExistedOrderByTaobaoNo([]);
      let res;
      try {
        res = await privateApiCall<Order[]>(
          `/orders/taobao_no/${taobaoOrderNo}`,
          "GET"
        );
      } catch (err) {
        console.log(err);
        setExistedOrderByTaobaoNo([]);
        return false;
      }
      setExistedOrderByTaobaoNo(res);
      return res.length !== 0;
    };
    if (taobaoOrderNo.length !== 0) {
      loadExistedOrderByTaobaoNo().then((existed) => {
        if (!existed) {
          let newDate = orderDatetimeRef.current
            .tz("Asia/Shanghai")
            .set("year", parseInt(taobaoOrderNo.slice(0, 4)))
            .set("month", parseInt(taobaoOrderNo.slice(4, 6)) - 1)
            .set("date", parseInt(taobaoOrderNo.slice(6, 8)));
          setOrderDatetimeRef.current(newDate.utc());
        }
      });
    }
  }, [taobaoOrderNo]);

  const setOrderDatetimeRef = useRef<typeof setOrderDatetime>(setOrderDatetime);
  const setCustomerIdRef = useRef<typeof setCustomerId>(setCustomerId);
  const orderDatetimeRef = useRef<typeof orderDatetime>(orderDatetime);

  useEffect(() => {
    if (existedOrderByTaobaoNo.length !== 0) {
      setCustomerIdRef.current(existedOrderByTaobaoNo[0].customerId);
      setOrderDatetimeRef.current(
        dayjs.unix(existedOrderByTaobaoNo[0].orderDatetime).utc()
      );
    }
  }, [existedOrderByTaobaoNo]);

  const handleSubmitOnClick = async () => {
    if (orderItemList.length === 0) {
      toast.warn("商品が登録されていません");
      return;
    }
    if (customerId === "") {
      setCustomerIdIsError(true);
      setTimeout(() => setCustomerIdIsError(false), 1000);
      toast.error("お客様Idが入力されていません");
      return;
    }

    if (taobaoOrderNo.length === 0) {
      setTaobaoOrderNoIsError(true);
      setTimeout(() => setTaobaoOrderNoIsError(false), 1000);
      toast.error("取引Noが入っていません");
      return;
    }
    if (!isValidTaobaoOrderNo(taobaoOrderNo)) {
      setTaobaoOrderNoIsError(true);
      setTimeout(() => setTaobaoOrderNoIsError(false), 1000);
      toast.error("交易号格式不正确");
      return;
    }

    setLoading(true);
    let items: InputOrderItem[] = orderItemList.map(
      ([itemCodeExt, orderItem]) => ({
        itemCodeExt,
        rate: orderItem.rate,
        quantity: orderItem.quantity,
        price: orderItem.price!,
        isManual: orderItem.isManual!,
      })
    );

    const input: OrderRegisterInput = {
      taobaoOrderNo: taobaoOrderNo.trim(),
      customerId,
      note,
      items,
      orderDatetime: orderDatetime.unix(),
    };
    try {
      await privateApiCall("/orders/", "POST", JSON.stringify(input));
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
          toast.error("注文作成が失敗しました" + err);
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    setTaobaoOrderNo("");
    setCustomerId("");
    setNote("");
    setItemCode("");
    clearItemMap();
    sendInventorySignal(inventorySignal + 1);
    sendOrderListSignal(orderListSignal + 1);
    sendShipmentSignal(shipmentSignal + 1);
    sendIsInStockSignal(isInStockSignal + 1);
    toast.success("注文を作成しました");
  };

  return (
    <Wrapper>
      <InputAreaWrapper>
        <OtherInfoWrapper>
          <OtherInfoInput
            isError={taobaoOrderNoIsError}
            name="taobaoOrderNo"
            placeholder="交易号"
            themeColor={
              existedOrderByTaobaoNo.length !== 0 ? Color.Success : undefined
            }
            value={taobaoOrderNo}
            onChange={handleInputValueChange}
          />
          <OtherInfoInput
            isError={customerIdIsError}
            name="customerId"
            placeholder="お客様Id"
            value={customerId}
            onChange={handleInputValueChange}
          />
          {existedOrderByTaobaoNo.length !== 0 ? (
            <div className=" text-green-500">
              {t("common.taobaoOrderNoExisted")}
            </div>
          ) : null}
        </OtherInfoWrapper>
        <OtherInfoWrapper>
          <DateInput
            type="datetime-local"
            name="orderDatetime"
            value={orderDatetime.tz("Asia/Shanghai").format("YYYY-MM-DDThh:mm")}
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
          注文登録
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

const OtherInfoInput = styled(Input)<InputProps>`
  font-size: 1rem;
  width: 170px;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
`;

const OtherInfoWrapper = styled.div`
  gap: 5px;
  flex-grow: 1;
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

const DateInput = styled(Input)`
  font-size: 0.8rem;
`;
