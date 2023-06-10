import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { privateApiCall } from "../../../lib/utility";
import { isLoadingModalOpen } from "../../../store";
import { AppError } from "../../../type/error";
import {
  shipmentDatetimeAtom,
  shipmentItemListAtom,
  shipmentLocationAtom,
} from "../../../store/newShipment";
import { shipmentNoteAtom } from "../../../store/newShipment";
import Input from "../../../styles/atoms/Input";
import { Color } from "../../../styles/Color";
import { InventoryLocation } from "../../../type/inventory";
import {
  ACHIEVED_VENDORS,
  NewShipmentInput,
  Vendor,
  vendors,
} from "../../../type/shipment";
import { ButtonCompo } from "../../ButtonCompo";
import { RadioButton } from "../../RadioButton";

export const ControlPanel = () => {
  const { t } = useTranslation(["common", "message", "shipments"]);
  const [shipmentItemList, setShipmentItemList] = useAtom(shipmentItemListAtom);
  const [shipmentNo, setShipmentNo] = useState("");
  const [shipmentNoIsError, setShipmentNoIsError] = useState(false);
  const [shipDate, setShipDate] = useAtom(shipmentDatetimeAtom);
  const [note, setNote] = useAtom(shipmentNoteAtom);
  const [vendor, setVendor] = useState<Vendor>("yy");
  const [fixedVendor, setFixedVendor] = useState<Vendor | undefined>(undefined);
  const [disabledVendors, setDisabledVendors] = useState<Vendor[] | undefined>(
    undefined
  );
  const shipmentLocation = useAtomValue(shipmentLocationAtom);
  const [loading, setLoading] = useAtom(isLoadingModalOpen);
  useEffect(() => {
    switch (shipmentLocation) {
      case InventoryLocation.CN:
        setVendor("ml");
        setFixedVendor("ml");
        setDisabledVendors(undefined);
        break;
      case InventoryLocation.PCN:
        setVendor("pml");
        setFixedVendor("pml");
        setDisabledVendors(undefined);
        break;
      case InventoryLocation.JP:
        setVendor("yy");
        setFixedVendor(undefined);
        setDisabledVendors(["ml", "pml"]);
        break;
      default:
        setVendor("yy");
        setFixedVendor(undefined);
        setDisabledVendors(undefined);
    }
  }, [shipmentLocation]);

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "shipmentNo":
        setShipmentNo(value);
        break;
      case "note":
        setNote(value);
        break;
      case "vendor":
        setVendor(value as Vendor);
        break;
      case "shipDate":
        setShipDate(e.target.value);
        break;
    }
  };

  const handleSubmitOnClick = async () => {
    if (shipmentItemList.length === 0) {
      toast.warn(
        t("common.warn.valueNotActed", {
          ns: "message",
          value: t("order"),
          action: t("apply"),
        })
      );
      return;
    }
    if (shipmentNo === "") {
      setShipmentNoIsError(true);
      setTimeout(() => setShipmentNoIsError(false), 1000);
      toast.warn(
        t("common.warn.valueNotActed", {
          ns: "message",
          value: t("payload") + t("number"),
          action: t("input"),
        })
      );
      return;
    }
    setLoading(true);
    const input: NewShipmentInput = {
      shipmentNo: shipmentNo.trim(),
      note,
      vendor,
      itemIds: shipmentItemList
        .sort((a, b) => a[0].customerId.localeCompare(b[0].customerId))
        .map((i) => i[0].id),
      shipmentDate: dayjs(shipDate).unix(),
    };
    try {
      await privateApiCall("/shipment", "POST", JSON.stringify(input));
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
          toast.error(
            t("common.error.actionValueFailed", {
              ns: "message",
              value: t("shipment"),
              action: t("apply"),
            })
          );
      }
      console.log(err);

      setLoading(false);
      return;
    }
    setLoading(false);
    setShipmentNo("");
    setNote("");
    setVendor("yy");
    setShipmentItemList([]);
    toast.success(
      t("common.success.beenActed", {
        ns: "message",
        value: t("shipment"),
        action: t("apply"),
      })
    );
  };

  return (
    <Wrapper>
      <InputAreaWrapper>
        <VendorInfo>
          <TaobaoOrderNoInput
            isError={shipmentNoIsError}
            name="shipmentNo"
            placeholder={t("payload") + t("number")}
            value={shipmentNo}
            onChange={handleInputValueChange}
          />
          <RadioButton
            members={vendors.filter(
              (vendor) => !ACHIEVED_VENDORS.includes(vendor)
            )}
            state={vendor}
            setAction={setVendor}
            fixedMember={fixedVendor}
            disables={disabledVendors}
            ns="shipments"
            keyPrefix="vendor"
          />
        </VendorInfo>
        <OtherInfoWrapper>
          <Input
            type="date"
            className=" text-sm"
            name="shipDate"
            value={shipDate}
            onChange={handleInputValueChange}
          />
          <NoteInput
            isError={false}
            name="note"
            placeholder={t("note")}
            value={note}
            onChange={handleInputValueChange}
          />
        </OtherInfoWrapper>
      </InputAreaWrapper>
      <RegisterButtonWrapper>
        <ButtonCompo
          onClick={handleSubmitOnClick}
          fontSize="2rem"
          disabled={loading}
        >
          {t("shipment") + t("apply")}
        </ButtonCompo>
      </RegisterButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  box-sizing: border-box;
  grid-area: ctl;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

interface InputProps {
  isError: boolean;
}

const VendorInfo = styled.div`
  gap: 5px;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const TaobaoOrderNoInput = styled(Input)<InputProps>`
  font-size: 1.3rem;
  ${(props) =>
    props.isError
      ? `box-shadow: 0 0 0.3em ${Color.Error};border-color:${Color.Error}`
      : null};
`;

const OtherInfoInput = styled(Input)<InputProps>`
  font-size: 1rem;
  width: 120px;
  ${(props) =>
    props.isError
      ? `box-shadow: 0 0 0.3em ${Color.Error};border-color:${Color.Error}`
      : null};
`;

const NoteInput = styled(OtherInfoInput)`
  width: 300px;
`;

const InputAreaWrapper = styled.div`
  flex-grow: 1;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
`;

const OtherInfoWrapper = styled.div`
  gap: 5px;
  flex-grow: 1;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const RegisterButtonWrapper = styled.div`
  display: flex;
  height: 100%;
  min-width: 100px;
  align-items: center;
  justify-content: center;
`;
