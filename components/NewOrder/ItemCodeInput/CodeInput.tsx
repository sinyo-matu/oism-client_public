import { useAtom } from "jotai";
import React, { useState } from "react";
import InputBase from "../../../styles/atoms/Input";
import styled from "styled-components";
import {
  isManualInputAtom,
  itemCodeAtom,
  suggestionInputValue,
  suggestionKeywordAtom,
} from "../../../store/newOrder";
import { repSearch } from "../../../lib/utility";

export const CodeInput = () => {
  const [inputValue, setInputValue] = useAtom(suggestionInputValue);
  const [, setSuggestionKeyword] = useAtom(suggestionKeywordAtom);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [, setItemCode] = useAtom(itemCodeAtom);
  const [isManual, setIsManual] = useAtom(isManualInputAtom);
  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = repSearch(e.target.value);
    setInputValue(value);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        if (value.length <= 2) return;
        setSuggestionKeyword(value);
      }, 500)
    );
  };

  return (
    <Wrapper>
      <Input
        placeholder="品番"
        value={inputValue}
        onChange={onInputValueChange}
        onFocus={(e) => {
          setItemCode("");
          setIsManual(false);
          if (e.target.value.length !== 0) {
            setInputValue("");
            setSuggestionKeyword("");
          }
        }}
        themeColor={isManual ? "grey" : undefined}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled(InputBase)`
  font-size: 1.2rem;
  width: 180px;
`;
