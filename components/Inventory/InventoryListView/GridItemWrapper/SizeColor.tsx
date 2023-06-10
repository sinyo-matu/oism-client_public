import React from "react";
import styled from "styled-components";

export const SizeColor = ({ size, color }: { size: string; color: string }) => {
  return (
    <SizeColorWrapper>
      <SizeColorContent>{size !== "9" ? `${size})` : null}</SizeColorContent>
      <SizeColorContent>
        <ColorContent>{color}</ColorContent>
      </SizeColorContent>
    </SizeColorWrapper>
  );
};

const SizeColorWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 3px;
  left: 8px;
  top: 5px;
  z-index: 2;
`;
const SizeColorContent = styled.div`
  text-align: center;
`;

const ColorContent = styled.div`
  border: 1px solid;
  font-size: 0.8rem;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 0 0.4rem 1px 0.4rem;
  text-align: center;
`;
