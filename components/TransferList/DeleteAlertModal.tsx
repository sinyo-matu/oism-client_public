import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { privateApiCall } from "../../lib/utility";
import { deleteAlertOpenAtom, returnForDelete } from "../../store/transferList";
import { AppError } from "../../type/error";
import { ConfirmModal } from "../ConfirmModal";

export const DeleteAlertModal = () => {
  const { t } = useTranslation("message");
  const [isOpen, setIsOpen] = useAtom(deleteAlertOpenAtom);
  const [item] = useAtom(returnForDelete);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    try {
      await privateApiCall(`/transfer/${item!.id}`, "DELETE");
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
          toast.error(t("common.error.concealFailed"));
      }
      console.log(err);
      setLoading(false);
      setIsOpen(false);
      return;
    }
    setLoading(false);
    setIsOpen(false);
    toast.success(
      t("common.success.beenConcealed", { value: item?.shipmentNo })
    );
  };
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      loading={loading}
      onConfirmClicked={onConfirmClicked}
      title={t("common.info.concealConfirm")}
    />
  );
};
