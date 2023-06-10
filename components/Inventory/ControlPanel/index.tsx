import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { Suspense, useState } from "react";
import styled from "styled-components";
import { repSearch } from "../../../lib/utility";
import {
  locationForExport,
  queryKeyWordAtom,
  queryLocationAtom,
  queryShowZeroQuantityAtom,
  showExportModalAtom,
} from "../../../store/inventory";
import InputBase from "../../../styles/atoms/Input";
import { Color } from "../../../styles/Color";
import { InventoryLocation, inventoryLocations } from "../../../type/inventory";
import { ButtonCompo } from "../../ButtonCompo";
import { RadioButton } from "../../RadioButton";
import { TotalCount } from "./TotalCount";

export const ControlPanel = () => {
  const { t } = useTranslation(["common", "inventory"]);
  const [keyword, setKeyword] = useAtom(queryKeyWordAtom);
  const [location, setLocation] = useAtom(queryLocationAtom);
  const [keywordValue, setKeywordValue] = useState(keyword);
  const [showZeroQuantity, setShowZeroQuantity] = useAtom(
    queryShowZeroQuantityAtom
  );
  const setExportModalOpen = useSetAtom(showExportModalAtom);
  const setLocationForExport = useSetAtom(locationForExport);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = repSearch(e.target.value);
    setKeywordValue(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setKeyword(value), 500));
  };

  return (
    <>
      <div className="hidden lg:flex lg:justify-between z-10 items-center gap-2 w-full p-2 top-[56px] sticky bg-white box-border">
        <div className="flex gap-2 items-center">
          <Input
            value={keywordValue}
            onChange={handleInputOnChange}
            placeholder={`${t("inventory")}${t("search")}`}
          />
          <Suspense fallback={"loading"}>
            <TotalCount />
          </Suspense>
        </div>
        <div className="flex gap-2 items-center">
          <ButtonCompo
            fontSize="0.9rem"
            color={Color.Success}
            onClick={() => {
              setLocationForExport(InventoryLocation.JP);
              setExportModalOpen(true);
            }}
          >
            {t(`location.${InventoryLocation.JP}`, { ns: "inventory" }) +
              t("export")}
          </ButtonCompo>
          <ButtonCompo
            fontSize="0.9rem"
            color={Color.Success}
            onClick={() => {
              setLocationForExport(InventoryLocation.CN);
              setExportModalOpen(true);
            }}
          >
            {t(`location.${InventoryLocation.CN}`, { ns: "inventory" }) +
              t("export")}
          </ButtonCompo>
          <RadioButton
            state={location}
            setAction={setLocation}
            members={inventoryLocations}
            nullable
            ns="inventory"
            keyPrefix="location"
          />
          <ButtonCompo
            selected={showZeroQuantity}
            color={Color.SUB}
            fontSize="1rem"
            onClick={() => {
              setShowZeroQuantity(!showZeroQuantity);
            }}
          >
            {t("showNoInventory")}
          </ButtonCompo>
        </div>
      </div>

      <div className=" flex lg:hidden flex-col items-center content-center p-2 gap-2 top-[56px] z-10 w-full sticky bg-white ">
        <div className="flex items-center justify-between w-full">
          <InputBase
            value={keywordValue}
            onChange={handleInputOnChange}
            placeholder={`${t("inventory")}${t("search")}`}
            className="text-sm"
          />
          <Suspense fallback={"loading"}>
            <TotalCount />
          </Suspense>
        </div>
        <div className="flex items-center justify-between w-full">
          <RadioButton
            state={location}
            setAction={setLocation}
            members={inventoryLocations}
            nullable
            ns="inventory"
            keyPrefix="location"
          />
          <ButtonCompo
            selected={showZeroQuantity}
            color={Color.SUB}
            fontSize="1rem"
            onClick={() => {
              setShowZeroQuantity(!showZeroQuantity);
            }}
          >
            {t("showNoInventory")}
          </ButtonCompo>
        </div>
      </div>
    </>
  );
};

const Input = styled(InputBase)`
  box-sizing: border-box;
  padding: 9px;
  font-size: 1rem;
`;
