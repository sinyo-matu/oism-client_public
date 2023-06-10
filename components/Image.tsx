import React, { useEffect, useState } from "react";
import NextImage from "next/legacy/image";
import styled from "styled-components";
import FallBackPic from "../public/placeholder.png";
const myLoader = ({ src }: { src: string }) => {
  return `https://d2vg6jg1lu9m12.cloudfront.net/${src}`;
};

export const CustomImage = ({
  width,
  itemCode,
  colorNo,
  onClick,
}: {
  width: number;
  itemCode: string;
  colorNo: number;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}) => {
  const [imageNo, setImageNo] = useState(colorNo);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    setImageNo(colorNo);
  }, [colorNo]);

  return (
    <NextImageWrapper width={width}>
      {isError ? (
        <NextImage
          src={FallBackPic}
          height={(width / 3) * 4}
          width={width}
          onClick={onClick}
        />
      ) : (
        <NextImage
          loader={myLoader}
          src={`${itemCode}_${imageNo}.jpeg`}
          height={(width / 3) * 4}
          width={width}
          onError={() => setIsError(true)}
          onClick={onClick}
        />
      )}
    </NextImageWrapper>
  );
};
interface ImageProps {
  width: number;
}

const NextImageWrapper = styled.div<ImageProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.width / 20}px;
  overflow: hidden;
`;
