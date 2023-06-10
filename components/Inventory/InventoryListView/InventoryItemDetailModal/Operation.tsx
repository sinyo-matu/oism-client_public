import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import {
  privateApiCall,
  processInventoryOperationCount,
  stringifyDateDataToMonthDay,
} from "../../../../lib/utility";
import { InventoryOperation } from "../../../../type/invenope";
import { ShipmentLite, ShipmentStatus } from "../../../../type/shipment";
import { StatusWrapper } from "../../../ShipmentListView/ShipmentListItem/Meta";

export const Operation = ({
  operation,
  operations,
}: {
  operation: InventoryOperation;
  operations: InventoryOperation[];
}) => {
  const { t } = useTranslation("inventoryOperationType");

  return (
    <div className="w-full flex flex-wrap justify-between px-2">
      <div className="cursor-default">
        {stringifyDateDataToMonthDay(operation.time)}
      </div>
      <div className="flex justify-center gap-1">
        {operation.operationType.type === "move" && operation.count > 0 ? (
          <TransferStatus operation={operation} />
        ) : null}
        <div> {t(operation.operationType.type)}</div>
      </div>
      <div className="flex justify-between min-w-[80px]">
        {Object.values(
          processInventoryOperationCount(operation, [...operations])
        ).map((count, i) => {
          return <span key={i}>{count}</span>;
        })}
      </div>
    </div>
  );
};

const TransferStatus = ({ operation }: { operation: InventoryOperation }) => {
  const { t } = useTranslation("shipments");
  const [shipmentStatus, setShipmentStatus] = useState<ShipmentStatus | null>(
    null
  );
  useEffect(() => {
    const loadShipments = async () => {
      let shipments;
      try {
        shipments = await privateApiCall<ShipmentLite[]>(
          `/transfer/${operation.relatedId}/shipments`,
          "GET"
        );
      } catch (err) {
        console.log(err);
        setShipmentStatus(null);
        return;
      }
      if (shipments.length === 0) {
        return;
      }
      setShipmentStatus(shipments[0].status);
    };
    loadShipments();
  }, [operation]);

  if (!shipmentStatus) return null;

  return (
    <StatusWrapper isArrival={shipmentStatus === "arrival"}>
      {t("status." + shipmentStatus)}
    </StatusWrapper>
  );
};
