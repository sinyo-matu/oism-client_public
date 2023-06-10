import { useAtom } from "jotai";
import React, { useState } from "react";
import Input from "../styles/atoms/Input";
import { queryKeywordAtom } from "../store/registerList";
import { repSearch } from "../lib/utility";
interface Props {
  placeholder?: string;
  keywordAtom: typeof queryKeywordAtom;
  inputDelay?: number;
}

export const SearchKeywordInput = ({
  placeholder = "search...",
  keywordAtom,
  inputDelay = 500,
}: Props) => {
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [keywordValue, setKeywordValue] = useState(keyword);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = repSearch(e.target.value);
    setKeywordValue(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setKeyword(value), inputDelay));
  };
  return (
    <Input
      value={keywordValue}
      onChange={handleInputOnChange}
      placeholder={`${placeholder}`}
    />
  );
};
