import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Color } from "../../../styles/Color";
import { Shipment } from "../../../type/shipment";
import { OrderItemList } from "./OrderItemList";
import { Meta } from "./Meta";
import { shipmentStatusSignalAtom } from "../../../store/shipmentList";
import { useAtomValue } from "jotai";
import { privateApiCall } from "../../../lib/utility";

export const ShipmentListItem = ({ fromParent }: { fromParent: Shipment }) => {
  const [shipment, setShipment] = useState<Shipment>(fromParent);
  const statusSignal = useAtomValue(shipmentStatusSignalAtom);
  const shipmentRef = useRef<typeof shipment>(shipment);

  useEffect(() => {
    const loadShipment = async () => {
      let res = await privateApiCall<Shipment>(
        `/shipment/${fromParent.id}`,
        "GET"
      ).catch((err) => console.log(err));
      setShipment(res!);
    };
    if (!shipmentRef.current) {
      loadShipment();
      return;
    }
    const [signalId] = statusSignal;
    if (fromParent.id === signalId) {
      loadShipment();
    }
  }, [fromParent, statusSignal]);

  return (
    <Wrapper>
      <Meta shipment={shipment} setShipment={setShipment} />
      <OrderItemList items={shipment.items} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: 100%;
  border-radius: 15px;
  padding: 0 0 10px 0;
  box-shadow: 0px 0px 7px -5px ${Color.Black};
  transition: 0.5s;
  &:hover .controlPanel {
    opacity: 1;
  }
  &:hover {
    box-shadow: 0 0 7px -3px ${Color.Black};
  }
  &:hover .item-controlArea {
    opacity: 1;
  }
`;
