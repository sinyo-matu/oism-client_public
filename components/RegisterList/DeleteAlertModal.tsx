import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { privateApiCall } from "../../lib/utility";
import {
  deleteAlertOpenAtom,
  registerForDelete,
} from "../../store/registerList";
import { AppError } from "../../type/error";
import { ConfirmModal } from "../ConfirmModal";

export const DeleteAlertModal = () => {
  const { t } = useTranslation("message");
  const [isOpen, setIsOpen] = useAtom(deleteAlertOpenAtom);
  const [register] = useAtom(registerForDelete);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    try {
      await privateApiCall(`/registers/${register!.id}`, "DELETE");
    } catch (err) {
      switch (err) {
        //FIXME Do we need this?
        case AppError.RegisterCanNotDelete:
          toast.error("該当納品書の納品は移動されたため、削除できません");
          break;
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
      toast.error(t("common.error.deleteFailed"));
      setLoading(false);
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    toast.success(t("common.success.beenDeleted", { value: register!.no }));
  };
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      loading={loading}
      onConfirmClicked={onConfirmClicked}
      title={t("common.info.deleteConfirm")}
    />
  );
};
