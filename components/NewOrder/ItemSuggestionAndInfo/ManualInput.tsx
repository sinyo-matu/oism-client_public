import { useAtom } from "jotai";
import React, { useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  validatePriceInput,
  validateSizeColorNoInput,
  validationItemCodeInput,
} from "../../../lib/utility";
import { increaseItemListAtom } from "../../../store/newOrder";
import { HStack } from "../../../styles/atoms/HStack";
import InputBase from "../../../styles/atoms/Input";
import { VStack } from "../../../styles/atoms/VStack";
import { InventoryLocation } from "../../../type/inventory";
import { ButtonCompo } from "../../ButtonCompo";

export const ManualInput = () => {
  const [, increaseRegisterItemsList] = useAtom(increaseItemListAtom);
  const [itemCode, setItemCode] = useState("");
  const [sizeNo, setSizeNo] = useState("");
  const [colorNo, setColorNo] = useState("");
  const [price, setPrice] = useState("");

  const codeRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "code":
        if (value.length > 11 && !validationItemCodeInput(value)) {
          setItemCode("");
          codeRef.current?.focus();
          break;
        }
        setItemCode(value.replace(" ", "_").toUpperCase());
        break;
      case "size":
        if (value.length > 1) return;
        setSizeNo(value);
        break;
      case "color":
        if (value.length > 1) return;
        setColorNo(value);
        break;
      case "price":
        setPrice(value);
        break;
    }
  };

  const handleRegisterOnClick = async (
    _e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!validationItemCodeInput(itemCode)) {
      const message = {
        name: "ng",
      };
      toast.warn("入力に間違いがあります。");
      setItemCode("");
      codeRef.current?.focus();
      return;
    }

    if (!validateSizeColorNoInput(sizeNo)) {
      const message = {
        name: "ng",
      };
      toast.warn("入力に間違いがあります。");
      setSizeNo("");
      sizeRef.current?.focus();
      return;
    }
    if (!validateSizeColorNoInput(colorNo)) {
      const message = {
        name: "ng",
      };
      toast.warn("入力に間違いがあります。");
      setColorNo("");
      colorRef.current?.focus();
      return;
    }
    if (!validatePriceInput(price)) {
      const message = {
        name: "ng",
      };
      toast.warn("入力に間違いがあります。");
      setColorNo("");
      priceRef.current?.focus();
      return;
    }
    const message = {
      name: "ok",
    };
    increaseRegisterItemsList({
      itemCodeExt: `${itemCode}${sizeNo}${colorNo}`,
      count: 1,
      location: InventoryLocation.JP,
      price: Math.round(parseInt(price) * 1.1),
      isManual: true,
    });
  };

  useLayoutEffect(() => {
    codeRef.current?.focus();
  }, []);

  return (
    <>
      <InputAreaWrapper justify="center">
        <HStack justify="center">
          <Input
            ref={codeRef}
            value={itemCode}
            name="code"
            onChange={handleInputChange}
            placeholder="商品コード"
            onFocus={() => setItemCode("")}
          />
          <Input
            ref={sizeRef}
            value={sizeNo}
            name="size"
            onChange={handleInputChange}
            placeholder="サイズ番"
            onFocus={() => setSizeNo("")}
          />
          <Input
            ref={colorRef}
            value={colorNo}
            name="color"
            onChange={handleInputChange}
            placeholder="色番"
            onFocus={() => setColorNo("")}
          />
          <Input
            ref={priceRef}
            value={price}
            name="price"
            onChange={handleInputChange}
            placeholder="価格(税抜き)"
            onFocus={() => setPrice("")}
          />
        </HStack>
      </InputAreaWrapper>
      <HStack justify="end">
        <ButtonCompo fontSize="1rem" onClick={handleRegisterOnClick}>
          注文に登録
        </ButtonCompo>
      </HStack>
    </>
  );
};

const InputAreaWrapper = styled(VStack)`
  flex-grow: 1;
`;

const Input = styled(InputBase)`
  width: 33%;
  font-size: 1rem;
`;
