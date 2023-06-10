import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { privateApiCall } from "../../lib/utility";
import {
  transferForUpdateAtom,
  updateOpenAtom,
} from "../../store/transferList";
import Input from "../../styles/atoms/Input";
import { AppError } from "../../type/error";
import { Transfer } from "../../type/transfer";
import { ButtonCompo } from "../ButtonCompo";
import { ConfirmModal } from "../ConfirmModal";

export const UpdateTransferModal = () => {
  const { t } = useTranslation(["message", "common", "shipments"]);
  const [isOpen, setIsOpen] = useAtom(updateOpenAtom);
  const [item] = useAtom(transferForUpdateAtom);
  const [loading, setLoading] = useState(false);
  const [shipmentNoValue, setShipmentNoValue] = useState("");
  const [existedTransfers, setExistedTransfers] = useState<Transfer[]>([]);
  const [changeExistedTransfers, setChangeExistedTransfers] = useState(false);
  useEffect(() => {
    setShipmentNoValue(item?.shipmentNo);
    return () => {
      setChangeExistedTransfers(false);
      setShipmentNoValue("");
    };
  }, [item]);
  useEffect(() => {
    let controller = new AbortController();
    const loadExistedTransfer = async () => {
      const res = await privateApiCall<Transfer[]>(
        `/transfer/shipment_no/${item?.shipmentNo}`,
        "GET",
        "",
        controller
      ).catch((err) => {
        console.log(err);
      });
      if (res) {
        setExistedTransfers(res);
      } else {
        setExistedTransfers([]);
      }
    };
    if (item) {
      loadExistedTransfer();
    }
    return () => {
      controller.abort();
    };
  }, [item]);

  const closeModal = () => {
    setChangeExistedTransfers(false);
    setShipmentNoValue("");
    setIsOpen(false);
  };
  const handleShipmentNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipmentNoValue(e.target.value);
  };
  const onConfirmClicked = async () => {
    if (shipmentNoValue !== item.shipmentNo) {
      setLoading(true);
      try {
        await privateApiCall(
          `/transfer/${item.id}/shipment_no`,
          "PUT",
          JSON.stringify({
            shipmentNo: shipmentNoValue,
            updateRelatedTransfers: changeExistedTransfers,
          })
        );
      } catch (err) {
        console.log(err);
        switch (err) {
          case AppError.PermissionNotEnough:
            toast.error(
              t("common.error.permissionNotEnough", {
                ns: "message",
              })
            );
            break;
          default:
            toast.error(t("common.error.changeFailed") + err);
        }
        setLoading(false);
        setIsOpen(false);
        return;
      }
      toast.success(
        t("common.success.beenChanged", {
          value: `${item?.shipmentNo} to ${shipmentNoValue}`,
        })
      );
    }
    setLoading(false);
    setIsOpen(false);
  };
  if (!item) return null;
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      loading={loading}
      onConfirmClicked={onConfirmClicked}
      title={t("transfer", { ns: "common" }) + t("change", { ns: "common" })}
      infoContent={<></>}
      mainContent={
        <div className=" flex flex-col items-center w-full gap-3 pb-6">
          <ShipmentNoInput
            value={shipmentNoValue}
            onChange={handleShipmentNoChange}
            placeholder={t("common.shipmentNo", { ns: "shipments" })}
          />
          {existedTransfers.length - 1 !== 0 ? (
            <div className="flex gap-2 content-between items-center">
              <div>
                {t("common.hasSameShipmentNoTransfers", {
                  quantity: existedTransfers.length - 1,
                  ns: "shipments",
                })}
              </div>
              <ButtonCompo
                selected={changeExistedTransfers}
                onClick={() =>
                  setChangeExistedTransfers((previous) => !previous)
                }
              >
                変更
              </ButtonCompo>
            </div>
          ) : null}
        </div>
      }
    />
  );
};

const ShipmentNoInput = styled(Input)`
  font-size: 1.5rem;
  width: 80%;
`;
