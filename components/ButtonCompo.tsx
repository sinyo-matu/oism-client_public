import React, { useState } from "react";
import Button from "../styles/atoms/Button";

interface Props {
  children?: React.ReactElement | string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, name?: string) => void;
  type?: "circle" | "pill";
  buttonType?: "button" | "submit" | "reset";
  selected?: boolean;
  name?: string;
  animated?: boolean;
  fontSize?: string;
  padding?: string;
  color?: string;
  sizeType?: "fitText";
  disabled?: boolean;
}

export const ButtonCompo = ({
  buttonType,
  children,
  onClick,
  type,
  selected,
  padding,
  name,
  fontSize,
  color,
  sizeType,
  disabled = false,
  animated = true,
}: Props) => {
  const [clicked, setClicked] = useState(false);
  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event, name);
    }
    setClicked(true);
    if (animated) setTimeout(() => setClicked(false), 500);
  };
  return (
    <Button
      type={buttonType}
      disabled={disabled}
      fontSize={fontSize}
      clicked={animated && clicked}
      padding={padding}
      buttontype={type}
      onClick={handleOnClick}
      selected={selected}
      color={color}
      sizeType={sizeType}
    >
      {children}
    </Button>
  );
};
