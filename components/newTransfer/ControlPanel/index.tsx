import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { privateApiCall } from "../../../lib/utility";
import { isLoadingModalOpen } from "../../../store";
import { inventoryItemSignal } from "../../../store/inventory";
import { itemIsInStockSignalAtom } from "../../../store/newOrder";
import { returnInventorySuggestionSignalAtom } from "../../../store/newReturn";
import { shipmentItemSuggestionSignalAtom } from "../../../store/newShipment";
import {
  clearItemListAtom,
  shipmentNoAtom,
  toLocationAtom,
  transferDatetimeAtom,
  transferInventorySuggestionSignalAtom,
  transferNoteAtom,
  vendorAtom,
} from "../../../store/newTransfer";
import { ordersAtomSignal } from "../../../store/orderList";
import Input from "../../../styles/atoms/Input";
import { Color } from "../../../styles/Color";
import { RegisterItem } from "../../../type";
import { AppError } from "../../../type/error";
import {
  ACHIEVED_VENDORS,
  ShipmentLite,
  Vendor,
  vendors,
} from "../../../type/shipment";
import { NewTransferMessage } from "../../../type/transfer";
import { ButtonCompo } from "../../ButtonCompo";
import { RadioButton } from "../../RadioButton";

export const ControlPanel = () => {
  const { t } = useTranslation(["common", "message", "shipments"]);
  const [transferItemsList, clearTransferItemsList] =
    useAtom(clearItemListAtom);
  const [shipmentNo, setShipmentNo] = useAtom(shipmentNoAtom);
  const [shipmentNoValue, setShipmentNoValue] = useState(shipmentNo);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [existedShipment, setExistedShipment] = useState<ShipmentLite | null>(
    null
  );
  const toLocation = useAtomValue(toLocationAtom);
  const [shipmentNoIsError, setShipmentNoIsError] = useState(false);
  const [transferDate, setTransferDate] = useAtom(transferDatetimeAtom);
  const [note, setNote] = useAtom(transferNoteAtom);
  const [vendor, setVendor] = useAtom(vendorAtom);
  const [inventorySignal, sendInventorySignal] = useAtom(inventoryItemSignal);
  const [orderListSignal, sendOrderListSignal] = useAtom(ordersAtomSignal);
  const [isInStockSignal, sendIsInStockSignal] = useAtom(
    itemIsInStockSignalAtom
  );
  const [transferInventorySignal, sendTransferInventorySignal] = useAtom(
    transferInventorySuggestionSignalAtom
  );
  const [returnInventorySignal, sendReturnInventorySignal] = useAtom(
    returnInventorySuggestionSignalAtom
  );
  const [shipmentSignal, sendShipmentSignal] = useAtom(
    shipmentItemSuggestionSignalAtom
  );
  const [loading, setLoading] = useAtom(isLoadingModalOpen);
  useEffect(() => {
    const loadExistedShipment = async () => {
      if (shipmentNo.length <= 2) setExistedShipment(null);
      const res = await privateApiCall<ShipmentLite[] | null>(
        `/shipment/by_no/${shipmentNo}`,
        "GET"
      ).catch((err) => {
        console.log(err);
      });
      if (res) {
        setExistedShipment(res[0]);
      } else {
        setExistedShipment(null);
      }
    };
    if (shipmentNo.length !== 0) {
      loadExistedShipment();
    }
  }, [shipmentNo]);
  const setTransferDateRef = useRef<typeof setTransferDate>(setTransferDate);
  const setVendorRef = useRef<typeof setVendor>(setVendor);

  useEffect(() => {
    if (existedShipment) {
      setVendorRef.current(existedShipment.vendor);
      setTransferDateRef.current(
        dayjs(existedShipment.shipmentDate).format("YYYY-MM-DD")
      );
    }
  }, [existedShipment]);
  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "shipmentNoValue":
        setShipmentNoValue(value);
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(
          setTimeout(() => {
            setShipmentNo(value);
          }, 200)
        );
        break;
      case "note":
        setNote(value);
        break;
      case "transferDate":
        setTransferDate(e.target.value);
        break;
    }
  };

  const handleSubmitOnClick = async () => {
    if (transferItemsList.size === 0) {
      toast.warn("返品が登録されていません");
      return;
    }
    if (shipmentNoValue === "") {
      setShipmentNoIsError(true);
      setTimeout(() => setShipmentNoIsError(false), 1000);
      toast.error("返品番号が入力されていません");
      return;
    }
    setLoading(true);
    const transferItems = Array.from(transferItemsList).map(
      ([key, [item]]) => ({
        itemCodeExt: item.itemCodeExt,
        quantity: item.quantity,
      })
    );
    const message: NewTransferMessage = {
      shipmentNo: shipmentNoValue.trim(),
      transferDate: dayjs(transferDate).unix(),
      note,
      shipmentVendor: vendor,
      toLocation,
      items: transferItems,
    };
    try {
      await privateApiCall("/transfer", "POST", JSON.stringify(message));
    } catch (err) {
      switch (err) {
        case AppError.Changed:
          toast.error(
            "在庫情報が更新されたため、移動できませんでした。再度お試しください"
          );
          break;
        case AppError.InventoryNotFound:
          toast.error("在庫情報が削除されたため、移動操作ができません");
          break;
        case AppError.PermissionNotEnough:
          toast.error(
            t("common.error.permissionNotEnough", {
              ns: "message",
            })
          );
          break;
        default:
          toast.error("移動が失敗しました");
      }
      console.log(err);
      setLoading(false);
      sendInventorySignal(inventorySignal + 1);
      sendIsInStockSignal(isInStockSignal + 1);
      return;
    }
    setLoading(false);
    clearTransferItemsList();
    setShipmentNoValue("");
    sendInventorySignal(inventorySignal + 1);
    sendIsInStockSignal(isInStockSignal + 1);
    sendTransferInventorySignal(transferInventorySignal + 1);
    sendReturnInventorySignal(returnInventorySignal + 1);
    toast.success(`移動が完了しましました`);

    setLoading(true);
    transferItems.forEach(async (item) => {
      const items: RegisterItem[] = [
        { itemCodeExt: item.itemCodeExt, count: 1 }, //count has no affection
      ];
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
        sendShipmentSignal(shipmentSignal + 1);
        check_res.forEach((customerId) =>
          toast.success(`${customerId}さんの注文が確保されました`)
        );
      }
    });
    setLoading(false);
  };

  return (
    <Wrapper>
      <InputAreaWrapper>
        <VendorInfo>
          <TaobaoOrderNoInput
            isError={shipmentNoIsError}
            name="shipmentNoValue"
            placeholder="荷物番号"
            value={shipmentNoValue}
            onChange={handleInputValueChange}
            themeColor={existedShipment ? Color.Success : undefined}
          />
          <RadioButton
            fixedMember={existedShipment?.vendor}
            members={vendors.filter((v) => !ACHIEVED_VENDORS.includes(v))}
            state={vendor}
            setAction={setVendor}
            ns="shipments"
            keyPrefix="vendor"
          />
        </VendorInfo>
        <OtherInfoWrapper>
          <Input
            type="date"
            name="transferDate"
            className=" text-sm"
            value={transferDate}
            disabled={existedShipment ? true : false}
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
          移動登録
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
