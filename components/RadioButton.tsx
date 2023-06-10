import { t } from "i18next";
import { SetStateAction } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import { Color } from "../styles/Color";
import { ButtonCompo } from "./ButtonCompo";

export function RadioButton<T>({
  members,
  state,
  setAction,
  effect,
  fixedMember,
  nullable,
  color,
  ns,
  keyPrefix,
  disables,
}: {
  members: T[] | readonly T[];
  state: T;
  setAction:
    | React.Dispatch<React.SetStateAction<T>>
    | ((update: SetStateAction<T>) => void);
  effect?: () => void;
  fixedMember?: T;
  nullable?: boolean;
  color?: string;
  ns?: string;
  keyPrefix?: string;
  disables?: T[];
}) {
  return (
    <RadioButtonsWrapper>
      {members.map((value) => {
        let disabled = false;
        if (fixedMember && fixedMember !== value) {
          disabled = true;
          return (
            <Button
              key={`${value}`}
              value={value}
              state={state}
              setAction={setAction}
              effect={effect}
              disabled={disabled}
              nullable={nullable}
              color={color}
              ns={ns}
              keyPrefix={keyPrefix}
            />
          );
        }

        if (disables?.includes(value)) {
          disabled = true;
        }

        return (
          <Button
            key={`${value}`}
            value={value}
            state={state}
            setAction={setAction}
            effect={effect}
            disabled={disabled}
            nullable={nullable}
            color={color}
            ns={ns}
            keyPrefix={keyPrefix}
          />
        );
      })}
    </RadioButtonsWrapper>
  );
}

const RadioButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

function Button<T>({
  value,
  state,
  setAction,
  effect,
  disabled,
  nullable = false,
  color = Color.SUB,
  ns,
  keyPrefix,
}: {
  value: T;
  state: T;
  setAction:
    | React.Dispatch<React.SetStateAction<T>>
    | ((update: SetStateAction<T>) => void);
  effect?: () => void;
  disabled?: boolean;
  nullable?: boolean;
  color?: string;
  ns?: string;
  keyPrefix?: string;
}) {
  const { t } = useTranslation(ns, {
    keyPrefix,
  });
  const handleOnClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    name: string | undefined
  ) => {
    if (value !== state) {
      setAction(value);
      if (effect) effect();
      return;
    }
    if (nullable) {
      switch (typeof state) {
        case "string":
          (
            setAction as
              | React.Dispatch<React.SetStateAction<T | null | "">>
              | ((update: SetStateAction<T | null | "">) => void)
          )("");
          return;
        default:
          (
            setAction as
              | React.Dispatch<React.SetStateAction<T | null | "">>
              | ((update: SetStateAction<T | null | "">) => void)
          )(null);
      }
    }
    return;
  };
  return (
    <ButtonCompo
      color={color}
      onClick={handleOnClick}
      selected={state === value}
      name={String(value)}
      sizeType="fitText"
      fontSize="0.9rem"
      disabled={disabled}
    >
      {t(String(value))}
    </ButtonCompo>
  );
}
