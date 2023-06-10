import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import { queryCategoryAtom } from "../../../store/inventory";
import { ButtonCompo } from "../../ButtonCompo";

export const CategoryButton = ({ name }: { name: string }) => {
  const { t } = useTranslation("itemCategory");
  const [category, setCategory] = useAtom(queryCategoryAtom);

  const handleOnClick = (
    _e: React.MouseEvent<HTMLButtonElement>,
    name: string | undefined
  ) => {
    if (category === "" || category !== name!) {
      setCategory(name!);
      return;
    }
    setCategory("");
  };

  return (
    <ButtonCompo
      fontSize="0.8rem"
      name={name}
      selected={category === name!}
      onClick={handleOnClick}
    >
      {t(name)}
    </ButtonCompo>
  );
};
