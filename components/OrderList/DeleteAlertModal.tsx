import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { privateApiCall, stringifyDateDataToDate } from "../../lib/utility";
import { deleteAlertOpenAtom, orderForDelete } from "../../store/orderList";
import { RegisterItem } from "../../type";
import { AppError } from "../../type/error";
import { ConfirmModal } from "../ConfirmModal";

export const DeleteAlertModal = () => {
  const { t } = useTranslation(["message", "common"]);
  const [isOpen, setIsOpen] = useAtom(deleteAlertOpenAtom);
  const [order] = useAtom(orderForDelete);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    try {
      await privateApiCall(`/orders/${order!.id}`, "DELETE");
    } catch (err) {
      if (err === AppError.OrderCanNotDelete) {
        toast.error("発送された商品があるため、削除できません");
        setIsOpen(false);
        setLoading(false);
        return;
      }
      console.log(err);
      toast.error(t("common.error.deleteFailed"));
      setLoading(false);
      setIsOpen(false);
      return;
    }
    setLoading(false);
    setIsOpen(false);
    toast.success(
      t("common.success.beenDeleted", {
        value:
          order?.customerId +
          t("deorno", { ns: "common" }) +
          t("order", { ns: "common" }),
      })
    );
    const items: RegisterItem[] = order!.items
      .filter((item) => item.status === "guaranteed")
      .map((item) => ({ itemCodeExt: item.itemCodeExt, count: 1 }));
    const check_res = await privateApiCall<string[]>(
      "/orders/check_then_update",
      "PUT",
      JSON.stringify({ items })
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
  };
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      onConfirmClicked={onConfirmClicked}
      infoContent={
        <>
          <div>{stringifyDateDataToDate(order?.createdAt)}</div>
          <div>{order?.customerId}</div>
          <div>商品{order?.items.length}点</div>
        </>
      }
      loading={loading}
      title={t("common.info.deleteConfirm")}
    />
  );
};
