import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { privateApiCall, triggerDownload } from "../../lib/utility";
import {
  exportByIdsModalOpenAtom,
  fromDateAtom,
  queryKeywordAtom,
  shipmentStatusAtom,
  shipmentVendorAtom,
  ToDateAtom,
} from "../../store/shipmentList";
import { DownloadUrl } from "../../type/shipment";
import { ConfirmModal } from "../ConfirmModal";

export const ExportByIdsModal = () => {
  const { t } = useTranslation(["message", "common"]);
  const [isOpen, setIsOpen] = useAtom(exportByIdsModalOpenAtom);
  const [loading, setLoading] = useState(false);
  const keyword = useAtomValue(queryKeywordAtom);
  const status = useAtomValue(shipmentStatusAtom);
  const vendor = useAtomValue(shipmentVendorAtom);
  const from_str = useAtomValue(fromDateAtom);
  const to_str = useAtomValue(ToDateAtom);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    const from = dayjs(from_str).unix();
    const to = dayjs(to_str + "23:59:59").unix();
    const params = `keyword=${keyword}&status=${status}&vendor=${vendor}&from=${from}&to=${to}`;
    try {
      const res = await privateApiCall<DownloadUrl>(
        `/shipment/export?${params}`,
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
    }
    setLoading(false);
    setIsOpen(false);
    toast.success(
      t("common.success.beenActed", {
        value: t("shipment", { ns: "common" }),
        action: t("export", { ns: "common" }),
      })
    );
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("common.info.actionConfirm", {
        action: t("export", { ns: "common" }),
      })}
      onConfirmClicked={onConfirmClicked}
      loading={loading}
    />
  );
};
