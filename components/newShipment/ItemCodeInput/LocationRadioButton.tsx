import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { shipmentLocationAtom } from "../../../store/newShipment";
import { HStack } from "../../../styles/atoms/HStack";
import { inventoryLocations } from "../../../type/inventory";
import { RadioButton } from "../../RadioButton";

export const LocationRadioButton = () => {
  const [shipmentLocation, setShipmentLocation] = useAtom(shipmentLocationAtom);
  return (
    <Wrapper justify="center">
      <RadioButton
        members={inventoryLocations}
        state={shipmentLocation}
        setAction={setShipmentLocation}
        nullable
        ns="inventory"
        keyPrefix="location"
      />
    </Wrapper>
  );
};

const Wrapper = styled(HStack)``;
