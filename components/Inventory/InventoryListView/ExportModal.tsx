import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { privateApiCall, triggerDownload } from "../../../lib/utility";
import {
  showExportModalAtom,
  locationForExport,
} from "../../../store/inventory";
import { DownloadUrl } from "../../../type/shipment";
import { ConfirmModal } from "../../ConfirmModal";

export const ExportModal = () => {
  const { t } = useTranslation(["message", "common", "inventory"]);
  const [isOpen, setIsOpen] = useAtom(showExportModalAtom);
  const location = useAtomValue(locationForExport);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    try {
      const res = await privateApiCall<DownloadUrl>(
        `/inventory/export?location=${location}`,
        "GET"
      );
      triggerDownload(res);
    } catch (err) {
      console.log(err);
      toast.error(
        t("common.error.actionFailed", {
          action: t("export", { ns: "common" }),
        })
      );
      setLoading(false);
      setIsOpen(false);
      return;
    }
    setLoading(false);
    setIsOpen(false);
    toast.success(
      t("common.success.beenActed", {
        value: `${t(`location.${location}`, { ns: "inventory" })}${t("deorno", {
          ns: "common",
        })}${t("inventory", { ns: "common" })}`,
        action: t("export", { ns: "common" }),
      })
    );
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      loading={loading}
      infoContent={
        <>
          <div>
            {t("export", { ns: "common" }) +
              ":" +
              t(`location.${location}`, { ns: "inventory" })}
          </div>
        </>
      }
      onConfirmClicked={onConfirmClicked}
      title={t("common.info.actionConfirm", {
        action: t("export", { ns: "common" }),
      })}
    />
  );
};
