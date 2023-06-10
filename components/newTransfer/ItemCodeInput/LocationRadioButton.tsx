import { useAtom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  clearItemListAtom,
  fromLocationAtom,
  transferListAtom,
} from "../../../store/newTransfer";
import { HStack } from "../../../styles/atoms/HStack";
import { inventoryLocations } from "../../../type/inventory";
import { RadioButton } from "../../RadioButton";

export const LocationRadioButton = () => {
  const [fromLocation, setFromLocation] = useAtom(fromLocationAtom);
  const clearList = useSetAtom(clearItemListAtom);
  const itemList = useAtomValue(transferListAtom);
  return (
    <Wrapper justify="center">
      <RadioButton
        members={inventoryLocations}
        state={fromLocation}
        setAction={setFromLocation}
        effect={() => {
          if (itemList.size !== 0) clearList();
        }}
        ns="inventory"
        keyPrefix="location"
      />
    </Wrapper>
  );
};

const Wrapper = styled(HStack)``;
