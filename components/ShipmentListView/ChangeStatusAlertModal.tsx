import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { privateApiCall, stringifyDateDataToDate } from "../../lib/utility";
import {
  changeStatusAlertOpenAtom,
  shipmentForChange,
} from "../../store/shipmentList";
import { AppError } from "../../type/error";
import { ConfirmModal } from "../ConfirmModal";

export const ChangeStatusAlertModal = () => {
  const { t } = useTranslation(["message", "common", "shipments"]);
  const [isOpen, setIsOpen] = useAtom(changeStatusAlertOpenAtom);
  const [shipment] = useAtom(shipmentForChange);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onConfirmClicked = async () => {
    setLoading(true);
    try {
      await privateApiCall(
        `/shipment/${shipment!.id}/status`,
        "PUT",
        JSON.stringify({
          status: shipment!.status === "ongoing" ? "arrival" : "ongoing",
        })
      );
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
          toast.error(t("common.error.changeFailed"));
      }
      console.log(err);
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
        action: t("change", { ns: "common" }),
      })
    );
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      infoContent={
        <>
          <div>{stringifyDateDataToDate(shipment?.createdAt)}</div>
          <div>{t(`vendor.${shipment?.vendor}`, { ns: "shipments" })}</div>
          <div>{shipment?.shipmentNo}</div>
        </>
      }
      title={t("common.changeTo", {
        ns: "shipments",
        status: t(
          `status.${shipment?.status === "ongoing" ? "arrival" : "ongoing"}`,
          { ns: "shipments" }
        ),
      })}
      loading={loading}
      onConfirmClicked={onConfirmClicked}
    />
  );
};

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
const ControlPanel = styled.div`
  width: 100%;
  justify-self: flex-end;
  display: flex;
  gap: 10px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
