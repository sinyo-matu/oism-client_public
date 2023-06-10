import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  privateApiCall,
  stringifyDateDataToDate,
  triggerDownload,
} from "../../lib/utility";
import { exportOpenAtom, shipmentForExport } from "../../store/shipmentList";
import { DownloadUrl } from "../../type/shipment";
import { ConfirmModal } from "../ConfirmModal";

export const ExportModal = () => {
  const { t } = useTranslation(["message", "common", "shipments"]);
  const [isOpen, setIsOpen] = useAtom(exportOpenAtom);
  const [shipment, isOnlyOrdered] = useAtomValue(shipmentForExport);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    const exportPath = isOnlyOrdered ? "export_ordered" : "export";
    try {
      const res = await privateApiCall<DownloadUrl>(
        `/shipment/${shipment!.id}/${exportPath}`,
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
        value: `${t(`vendor.${shipment?.vendor}`, { ns: "shipments" })}${t(
          "deorno",
          {
            ns: "common",
          }
        )}${shipment?.shipmentNo}`,
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
          <div>{stringifyDateDataToDate(shipment?.createdAt)}</div>
          <div>{t(`vendor.${shipment?.vendor}`, { ns: "shipments" })}</div>
          <div>{shipment?.shipmentNo}</div>
        </>
      }
      onConfirmClicked={onConfirmClicked}
      title={t("common.info.actionConfirm", {
        action: t("export", { ns: "common" }),
      })}
    />
  );
};
