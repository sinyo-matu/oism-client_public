import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { isLoadingModalOpen } from "../store";
import { blink } from "../styles/animation";
import Image from "next/legacy/image";
import Logo from "../public/logo.png";

export const LoadingModal = () => {
  const [isOpen] = useAtom(isLoadingModalOpen);

  return (
    <Wrapper show={isOpen}>
      <ContentWrapper>
        <Image src={Logo} alt="logo" />
      </ContentWrapper>
    </Wrapper>
  );
};

interface WrapperProps {
  show: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  position: fixed;
  display: ${(props) => (props.show ? "block" : "none")};
  left: 10px;
  bottom: 10px;
  opacity: 0.5;
  animation: ${blink} 1s linear infinite;
`;
const ContentWrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
