import type { GetServerSidePropsContext, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import CustomToastContainer from "../components/CustomToastContainer";
import { LoadingModal } from "../components/LoadingModal";
import { AppLayout } from "../layout/AppLayout";
import { StockRegister } from "../layout/StockRegister";

const Home: NextPage = () => {
  const { t } = useTranslation("nav");
  return (
    <>
      <Head>
        <title>OISM ー {t("newRegister")}</title>
      </Head>
      <AppLayout>
        <StockRegister />
      </AppLayout>
      <CustomToastContainer />
      <LoadingModal />
    </>
  );
};

export default Home;

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ja")),
      // Will be passed to the page component as props
    },
  };
}
