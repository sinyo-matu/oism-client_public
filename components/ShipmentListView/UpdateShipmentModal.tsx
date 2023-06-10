import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { privateApiCall } from "../../lib/utility";
import {
  shipmentForUpdateAtom,
  updateOpenAtom,
} from "../../store/shipmentList";
import Input from "../../styles/atoms/Input";
import { Color } from "../../styles/Color";
import { AppError } from "../../type/error";
import { ACHIEVED_VENDORS, Vendor, vendors } from "../../type/shipment";
import { Transfer } from "../../type/transfer";
import { ConfirmModal } from "../ConfirmModal";
import { RadioButton } from "../RadioButton";
import { ButtonCompo } from "../ButtonCompo";

export const UpdateShipmentModal = () => {
  const { t } = useTranslation(["message", "common", "shipments"]);
  const [isOpen, setIsOpen] = useAtom(updateOpenAtom);
  const [item] = useAtom(shipmentForUpdateAtom);
  const [loading, setLoading] = useState(false);
  const [shipmentNoValue, setShipmentNoValue] = useState("");
  const [vendor, setVendor] = useState(null as unknown as Vendor);
  const [vendorDisables, setVendorDisables] = useState<Vendor[]>([]);
  const [existedTransfers, setExistedTransfers] = useState<Transfer[]>([]);
  const [changeExistedTransfers, setChangeExistedTransfers] = useState(false);
  useEffect(() => {
    setShipmentNoValue(item?.shipmentNo);
    setVendor(item?.vendor);
    switch (item?.vendor) {
      case "ml": {
        setVendorDisables(vendors.filter((v) => v !== "ml"));
        break;
      }
      case "pml": {
        setVendorDisables(vendors.filter((v) => v !== "pml"));
        break;
      }
      default: {
        setVendorDisables(["pml", "ml"]);
      }
    }
    return () => {
      setChangeExistedTransfers(false);
      setShipmentNoValue("");
      setVendor(null as unknown as Vendor);
    };
  }, [item]);

  useEffect(() => {
    return () => {
      setChangeExistedTransfers(false);
      setShipmentNoValue("");
      setVendor(null as unknown as Vendor);
    };
  }, []);

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
    setShipmentNoValue(item.shipmentNo);
    setVendor(item.vendor);
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
          `/shipment/${item.id}/no`,
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
    if (vendor && vendor !== item.vendor) {
      try {
        await privateApiCall(
          `/shipment/${item.id}/vendor`,
          "PUT",
          JSON.stringify({
            newVendor: vendor,
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
          case AppError.InvalidOperation: {
            toast.error(
              t("common.error.invalidOperation", {
                ns: "message",
              })
            );
            break;
          }
          default:
            toast.error(t("common.error.changeFailed") + err);
        }
        setLoading(false);
        setIsOpen(false);
        return;
      }
      toast.success(
        t("common.success.beenChanged", {
          value: `${t(`vendor.${item?.vendor}`, { ns: "shipments" })} to ${t(
            `vendor.${vendor}`,
            { ns: "shipments" }
          )}`,
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
      title={t("shipment", { ns: "common" }) + t("change", { ns: "common" })}
      infoContent={
        <>
          <div>
            {t("vendor." + item.vendor, { ns: "shipments" })}:{item.shipmentNo}
          </div>
        </>
      }
      mainContent={
        <div className=" flex flex-col items-center w-full gap-3 pb-6">
          <ShipmentNoInput
            value={shipmentNoValue}
            onChange={handleShipmentNoChange}
            placeholder={t("common.shipmentNo", { ns: "shipments" })}
          />
          <RadioButton
            members={vendors.filter((v) => !ACHIEVED_VENDORS.includes(v))}
            state={vendor}
            setAction={setVendor}
            color={Color.SUB}
            disables={vendorDisables}
            nullable
            ns="shipments"
            keyPrefix="vendor"
          />
          {existedTransfers.length !== 0 ? (
            <div className="flex gap-2 content-between items-center">
              <div>
                {t("common.hasSameShipmentNoTransfers", {
                  quantity: existedTransfers.length,
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
