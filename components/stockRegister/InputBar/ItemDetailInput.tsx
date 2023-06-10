import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useSound from "../../../lib/hooks/useSound";
import { validationDetailInput } from "../../../lib/utility";
import {
  currentItemDetailCodeAtom,
  isManualInputAtom,
} from "../../../store/StockRegister";
import Input from "../../../styles/atoms/Input";

export const ItemDetailInput = () => {
  const [value1, setValue1] = useState("");
  const [playNg] = useSound({ toPlay: "ng" });
  const setCurrentItemDetailCode = useSetAtom(currentItemDetailCodeAtom);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [isManual, setIsManual] = useAtom(isManualInputAtom);
  const handleOnFocus = () => {
    setValue1("");
    setIsManual(false);
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(" ", "_");
    setValue1(code);
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(async () => {
        if (!validationDetailInput(code)) {
          toast.warn("入力に間違いがあります。");
          playNg();
          setValue1("");
          return;
        }
        setCurrentItemDetailCode(code);
      }, 500)
    );
  };
  return (
    <Input
      id="detailInput"
      onFocus={handleOnFocus}
      value={value1}
      placeholder="商品詳細コード"
      onChange={handleOnChange}
      themeColor={isManual ? "grey" : undefined}
    />
  );
};
