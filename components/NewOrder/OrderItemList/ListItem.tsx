import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { parseItemCode, privateApiCall } from "../../../lib/utility";
import {
  changeItemRateAtom,
  decreaseItemListAtom,
  deleteItemListAtom,
  increaseItemListAtom,
} from "../../../store/newOrder";
import { deriveFadeIn } from "../../../styles/animation";
import { CapsuleBadge } from "../../../styles/atoms/CapsuleBadge";
import { Color } from "../../../styles/Color";
import { Quantity } from "../../../type";
import { OrderListMapItem } from "../../../type/order";
import { ButtonCompo } from "../../ButtonCompo";
import { CustomImage } from "../../Image";
import InputBase from "../../../styles/atoms/Input";
import { VStack } from "../../../styles/atoms/VStack";
import { useSetAtom } from "jotai";
import { getEmptyQuantity, InventoryLocation } from "../../../type/inventory";
import { useTranslation } from "next-i18next";
export const ListItem = ({
  index,
  itemCodeExt,
  listMapItem,
}: {
  index: number;
  itemCodeExt: string;
  listMapItem: OrderListMapItem;
}) => {
  const { t } = useTranslation("inventory");
  const [itemCode, sizeNo, colorNo] = parseItemCode(itemCodeExt);
  const increase = useSetAtom(increaseItemListAtom);
  const decrease = useSetAtom(decreaseItemListAtom);
  const deleteItem = useSetAtom(deleteItemListAtom);
  const setItemRate = useSetAtom(changeItemRateAtom);
  const [rate, setRate] = useState("0");
  const [inventory, setInventory] = useState<Quantity[]>(getEmptyQuantity());
  const handlePlusOnClick = (
    _e: React.MouseEvent<HTMLButtonElement>,
    name: string | undefined
  ) => {
    increase({
      itemCodeExt: itemCodeExt,
      count: 1,
      location: name as InventoryLocation,
    });
  };
  const handleMinusOnClick = (
    _e: React.MouseEvent<HTMLButtonElement>,
    name: string | undefined
  ) => {
    decrease({
      itemCodeExt: itemCodeExt,
      count: 1,
      location: name as InventoryLocation,
    });
  };

  const handleSliderOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setRate(value);
    let parsed = parseInt(value);
    if (isNaN(parsed)) {
      return;
    }
    if (parsed > 100 || parsed < 0) return;
    setRate(value);
    setItemRate({ itemCodeExt: itemCodeExt, rate: (100 - parsed) / 100.0 });
  };

  useEffect(() => {
    const fetchInventory = async () => {
      let res;
      try {
        res = await privateApiCall<Quantity[]>(
          `/inventory/quantity/${itemCodeExt}`,
          "GET"
        );
      } catch (error) {
        console.log(error);
        res = getEmptyQuantity();
      }
      if (res.length === 0) {
        setInventory(getEmptyQuantity());
        return;
      }
      setInventory(res);
    };
    fetchInventory();
  }, [itemCodeExt]);

  return (
    <FadeInWrapper>
      <div>{index + 1}</div>
      <CustomImage
        width={100}
        itemCode={itemCode}
        colorNo={parseInt(colorNo)}
      />
      <InfoArea>
        <InfoRow>
          <InfoCell>{itemCode}</InfoCell>
          <InfoCell>{sizeNo}</InfoCell>
          <InfoCell background={Color.MAIN}>{colorNo}</InfoCell>
        </InfoRow>
        <InfoRow>
          <Content>
            {listMapItem.quantity.map((q) => {
              const i = inventory.filter((ia) => ia.location === q.location)[0]
                .quantity;
              if (q.quantity === 0 || i === 0) return null;
              return (
                <CapsuleBadge background={Color.Success} key={q.location}>
                  {t(`location.${q.location}`)}{" "}
                  {i >= q.quantity ? q.quantity : i}点確保
                </CapsuleBadge>
              );
            })}
          </Content>
        </InfoRow>
        <InfoRow>
          <Content>
            {listMapItem.quantity.map((q) => {
              const i = inventory.filter((ia) => ia.location === q.location)[0]
                .quantity;
              if (q.quantity - i === 0 || i >= q.quantity) return null;
              return (
                <CapsuleBadge background={Color.Error} key={q.location}>
                  {t(`location.${q.location}`)} {q.quantity - i}
                  点取寄
                </CapsuleBadge>
              );
            })}
          </Content>
        </InfoRow>
      </InfoArea>
      <ControlArea>
        <RangeSliderWrapper>
          <RateInput
            type="number"
            step={5}
            value={rate}
            onChange={handleSliderOnChange}
          />{" "}
          %Off
        </RangeSliderWrapper>
        <VStack justify="center">
          {listMapItem.quantity.map((q) => (
            <QuantityControlButtonsWrapper key={q.location}>
              {t(`location.${q.location}`)}:
              <ButtonCompo
                sizeType="fitText"
                fontSize="1rem"
                name={q.location}
                onClick={handleMinusOnClick}
              >
                -
              </ButtonCompo>
              <div>x{q.quantity}</div>
              <ButtonCompo
                sizeType="fitText"
                fontSize="1rem"
                name={q.location}
                onClick={handlePlusOnClick}
              >
                +
              </ButtonCompo>
            </QuantityControlButtonsWrapper>
          ))}
        </VStack>
        <ButtonCompo
          onClick={() =>
            deleteItem({
              itemCodeExt: itemCodeExt,
              count: 1,
              location: InventoryLocation.JP, // this is useless here
            })
          }
        >
          削除
        </ButtonCompo>
      </ControlArea>
    </FadeInWrapper>
  );
};
const Wrapper = styled.div`
  background-color: ${Color.Default};
  border: 1px solid ${Color.SUB};
  border-radius: 15px;
  color: ${Color.SUB};
  width: 100%;
  box-sizing: border-box;
  min-height: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 0 7px -5px ${Color.Black};
  gap: 10px;
  padding: 3px 15px;
  overflow: hidden;
  transition: 0.5s;
  &:hover {
    box-shadow: 0 0 7px -3px ${Color.Black};
    border-color: ${Color.MAIN};
  }
  &:hover .my-slider {
    background-color: ${Color.MAINLight};
  }
  &:hover .my-slider::-webkit-slider-thumb {
    background-color: ${Color.MAIN};
  }
`;

const FadeInWrapper = deriveFadeIn(Wrapper);

const InfoArea = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  gap: 5px;
  height: 90%;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: enter;
  justify-content: flex-start;
  min-height: 30px;
  gap: 5px;
`;

interface InfoCellProps {
  color?: string;
  background?: string;
}

const InfoCell = styled.div<InfoCellProps>`
  text-align: center;
  min-width: 40px;
  padding: 1px 7px;
  background-color: ${(props) =>
    props.background ? props.background : Color.SUB};
  border-radius: 999px;
  color: ${(props) => (props.color ? props.color : Color.Default)};
`;

const ControlArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const QuantityControlButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 130px;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  gap: 3px;
  align-items: center;
`;

const RangeSliderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;
const RateInput = styled(InputBase)`
  width: 60px;
  font-size: 1rem;
`;
