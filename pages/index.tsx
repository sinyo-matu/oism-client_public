import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { LoadingModal } from "../components/LoadingModal";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import { AppLayout } from "../layout/AppLayout";
import { OrderList } from "../layout/OrderList";
import CustomToastContainer from "../components/CustomToastContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Home: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>OISM ー {t("oismCatch")}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/touch-icon.png" />
      </Head>
      <AppLayout>
        <OrderList />
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
    },
  };
}
