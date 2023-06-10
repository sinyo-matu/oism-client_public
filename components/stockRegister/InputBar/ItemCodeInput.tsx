import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useSound from "../../../lib/hooks/useSound";
import { validationItemCodeInput } from "../../../lib/utility";
import {
  currentItemCodeAtom,
  currentItemDetailCodeAtom,
  isManualInputAtom,
} from "../../../store/StockRegister";
import Input from "../../../styles/atoms/Input";

export const ItemCodeInput = () => {
  const [playNg] = useSound({ toPlay: "ng" });
  const [value1, setValue1] = useState("");
  const setCurrentItemCode = useSetAtom(currentItemCodeAtom);
  const setCurrentItemDetailCode = useSetAtom(currentItemDetailCodeAtom);
  const [isManual, setIsManual] = useAtom(isManualInputAtom);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const handleOnFocus = () => {
    setValue1("");
    setCurrentItemCode("");
    setCurrentItemDetailCode("");
    setIsManual(false);
  };
  const ref = useRef<HTMLInputElement>(null);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(" ", "_");
    setValue1(code);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(async () => {
        if (!validationItemCodeInput(code)) {
          toast.warn("入力に間違いがあります。");
          playNg();
          setValue1("");
          return;
        }
        const input = document.getElementById("detailInput");
        input?.focus();
        setCurrentItemCode(code);
      }, 500)
    );
  };
  useEffect(() => {
    ref.current!.focus();
  }, []);
  return (
    <>
      <Input
        ref={ref}
        id="codeInput"
        onFocus={handleOnFocus}
        value={value1}
        placeholder="商品コード"
        onChange={handleOnChange}
        themeColor={isManual ? "grey" : undefined}
      />
    </>
  );
};
