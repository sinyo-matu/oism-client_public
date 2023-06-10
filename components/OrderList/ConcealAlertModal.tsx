import { useAtom } from "jotai";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { parseItemCode, privateApiCall } from "../../lib/utility";
import {
  concealAlertOpenAtom,
  orderItemForConcealAtom,
} from "../../store/orderList";
import { Color } from "../../styles/Color";
import { RegisterItem } from "../../type";
import { AppError } from "../../type/error";
import { OrderItemStatus } from "../../type/order";
import { CustomImage } from "../Image";
import { ConfirmModal } from "../ConfirmModal";
import { useTranslation } from "next-i18next";

export const ConcealAlertModal = () => {
  const { t } = useTranslation(["message", "common", "orderStatus"]);
  const [isOpen, setIsOpen] = useAtom(concealAlertOpenAtom);
  const [item] = useAtom(orderItemForConcealAtom);
  const [itemCode, , color] = parseItemCode(item?.itemCodeExt!);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    try {
      await privateApiCall(`/order_items/${item!.id}`, "DELETE");
    } catch (err) {
      console.log(err);
      setLoading(false);
      switch (err) {
        case AppError.OrderItemIsConcealed:
          toast.error(t("orderList.error.alreadyBeenConcealed"));
          break;
        default:
          toast.error(t("common.error.concealFailed"));
          return;
      }
      setIsOpen(false);
    }
    setLoading(false);
    setIsOpen(false);
    toast.success(
      t("common.success.beenConcealed", { value: item?.itemCodeExt })
    );
    if (item?.status === "guaranteed" || item?.status === "shipped") {
      const items: RegisterItem[] = [
        { itemCodeExt: item?.itemCodeExt!, count: 1 },
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
        check_res.forEach((customerId) =>
          toast.success(
            t("common.success.beenOccupied", {
              value:
                customerId +
                t("deorno", { ns: "common" }) +
                t("order", { ns: "common" }),
            })
          )
        );
      }
    }
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
          <StatusWrapper status={item?.status!}>
            {t(item?.status!, { ns: "orderStatus" })}
          </StatusWrapper>
        </>
      }
      mainContent={
        <CustomImage
          width={100}
          itemCode={itemCode}
          colorNo={parseInt(color)}
        />
      }
      title={t("common.info.concealConfirm")}
    />
  );
};

interface StatusWrapperProps {
  status: OrderItemStatus;
}

const StatusWrapper = styled.div<StatusWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    switch (props.status) {
      case "backordering":
        return Color.JPRed;
      case "guaranteed":
        return Color.MAIN;
      case "shipped":
        return Color.Success;
      case "concealed":
        return "gray";
    }
  }};
`;
