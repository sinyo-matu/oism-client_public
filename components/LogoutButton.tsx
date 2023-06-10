import React from "react";
import { ButtonCompo } from "./ButtonCompo";
import { useTranslation } from "next-i18next";
import Router from "next/router";

export default function LogoutButton() {
  const { t } = useTranslation(["common"]);
  const handleClickOnLogout = async () => {
    Router.push("/login");
  };
  return (
    <ButtonCompo
      fontSize="0.3rem"
      padding="0px 3px"
      buttonType="button"
      onClick={handleClickOnLogout}
    >
      {t("logout")}
    </ButtonCompo>
  );
}
