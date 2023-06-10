import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { useState } from "react";
import styled from "styled-components";
import InputBase from "../styles/atoms/Input";
import { ButtonCompo } from "../components/ButtonCompo";
import CustomToastContainer from "../components/CustomToastContainer";
import { toast } from "react-toastify";
import { publicApiCall } from "../lib/utility";
import Router from "next/router";
import Head from "next/head";
import OISM_Logo from "../public/oism-logo.png";
import Image from "next/legacy/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const LoginPage = ({
  redirectUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["common", "message"]);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");
  const [deniedCount, setDeniedCount] = useState(0);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "id":
        setId(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleLoginOnClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id.length === 0) {
      setIsError("id");
      setTimeout(() => setIsError(""), 1000);
      toast.error(t("login.error.noId", { ns: "message" }));
      return;
    }
    if (password.length === 0) {
      setIsError("password");
      setTimeout(() => setIsError(""), 1000);
      toast.error(t("login.error.noPassword", { ns: "message" }));
      return;
    }
    if (deniedCount > 3) {
      toast.error(t("login.error.needContact", { ns: "message" }));
      setId("");
      setPassword("");
      return;
    }
    let response;
    try {
      response = await publicApiCall(
        `/login`,
        "POST",
        JSON.stringify({ username: id, password })
      );
    } catch (error) {
      console.log(error);
      alert(error);
      return;
    }
    if (response?.status === 200) {
      Router.push(redirectUrl ?? "/");
      return;
    }
    setId("");
    setPassword("");
    toast.error(t("login.error.wrongLoginInfo", { ns: "message" }));
    setDeniedCount((current) => current + 1);
  };

  return (
    <>
      <Head>
        <title>OISM ー {t("login")}</title>
      </Head>
      <div className="flex items-center justify-center w-full h-screen">
        <LoginFormWrapper onSubmit={handleLoginOnClick}>
          <div className="w-full flex items-center justify-center  p-2">
            <Image src={OISM_Logo} alt="logo" height={150} width={150} />
          </div>
          <Input
            placeholder="ID"
            value={id}
            name="id"
            onChange={handleOnChange}
            isError={isError === "id"}
          />
          <Input
            placeholder="Password"
            value={password}
            name="password"
            type="password"
            onChange={handleOnChange}
            isError={isError === "password"}
          />
          <ButtonCompo fontSize="1.2rem" buttonType="submit">
            {t("login")}
          </ButtonCompo>
        </LoginFormWrapper>
        <CustomToastContainer />
      </div>
    </>
  );
};

const LoginFormWrapper = styled.form`
  position: relative;
  width: clamp(200px, 90%, 1440px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;

const Input = styled(InputBase)`
  box-sizing: border-box;
  max-width: 300px;
  width: 90%;
  padding: 9px;
  font-size: 1.5rem;
`;

export default LoginPage;

export async function getServerSideProps({
  locale,
  query,
}: GetServerSidePropsContext) {
  const redirectUrl = query["redirect_url"];
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ja")),
      // Will be passed to the page component as props
      redirectUrl: (redirectUrl as string | undefined) ?? null,
    },
  };
}
