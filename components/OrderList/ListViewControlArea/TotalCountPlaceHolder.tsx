import React from "react";
import styled from "styled-components";

export const TotalCountPlaceHolder = () => {
  return (
    <div className="flex">
      <Wrapper> 点</Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  display: flex;
  min-width: 50px;
  justify-content: flex-end;
`;
