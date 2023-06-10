import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { suggestionsAtom } from "../../../../store/newOrder";
import { SuggestionItem } from "./SuggestionItem";

export const ItemSuggestion = () => {
  const [suggestions] = useAtom(suggestionsAtom);

  if (suggestions.length === 0) return <div>商品を検索してください</div>;

  return (
    <Wrapper>
      {suggestions.map((item, i) => (
        <SuggestionItem key={item.code} item={item} index={i} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: calc(100vh - 220px);
  flex-direction: column;
  align-items: enter;
  justify-content: flex-start;
  gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
`;
