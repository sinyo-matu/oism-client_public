import { useTranslation } from "next-i18next";
import React, { Suspense } from "react";
import styled from "styled-components";
import {
  clickToCopyToClipboard,
  stringifyDateDataToDate,
} from "../../../../lib/utility";
import { Color } from "../../../../styles/Color";
import { Shipment } from "../../../../type/shipment";
import { ControlPanel } from "./ControlPanel";
import { Note } from "./Note";
import { TotalPrice } from "./TotalPrice";

export const Meta = ({
  shipment,
  setShipment,
}: {
  shipment: Shipment;
  setShipment: React.Dispatch<React.SetStateAction<Shipment>>;
}) => {
  const { t } = useTranslation("shipments");
  const item_q = shipment.items.length;
  return (
    <div className="metaWrapper w-full flex flex-col justify-between lg:flex-row p-2 items-start lg:items-center rounded-tl-2xl rounded-tr-2xl transition duration-500 gap-2 bg-sub">
      <div className="flex gap-2 content-center items-center">
        <NoWrapper>{t("vendor." + shipment.vendor)}</NoWrapper>
        <ShipmentNo onClick={clickToCopyToClipboard}>
          {shipment.shipmentNo}
        </ShipmentNo>
        <ShipmentNo>{item_q}点</ShipmentNo>
        <ShipmentNo>
          <Suspense fallback="">
            <TotalPrice shipment={shipment} />
          </Suspense>
        </ShipmentNo>
        <StatusWrapper isArrival={shipment.status === "arrival"}>
          {t("status." + shipment.status)}
        </StatusWrapper>
      </div>
      <div className="flex flex-grow content-center max-w-[450px]">
        <Note shipment={shipment} setShipment={setShipment} />
      </div>
      <div className="flex items-center text-default gap-1">
        {stringifyDateDataToDate(shipment.shipmentDate)}
        <ControlPanel shipment={shipment} />
      </div>
    </div>
  );
};
const DateWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  color: ${Color.Default};
  justify-content: flex-end;
  gap: 5px;
`;

const NoWrapper = styled.div`
  box-sizing: border-box;
  text-align: center;
  background-color: ${Color.Default};
  border: 1px solid ${Color.SUB};
  color: ${Color.SUB};
  border-radius: 999px;
  padding: 0px 7px;
`;

const ShipmentNo = styled(NoWrapper)`
  cursor: pointer;
`;

interface StatusWrapperProps {
  isArrival: boolean;
}

export const StatusWrapper = styled.div<StatusWrapperProps>`
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) =>
    props.isArrival ? Color.Success : Color.Error};
  border: 1px solid ${Color.SUB};
  color: ${Color.Default};
  border-radius: 999px;
  padding: 0px 7px;
`;
