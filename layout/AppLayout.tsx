import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import styled from "styled-components";
import LocaleSwitcher from "../components/LocalSwitcher";
import { NeedAuth } from "../components/NeedAuth";
import NewNav from "../components/NewNav";
import LogoutButton from "../components/LogoutButton";
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto flex flex-col items-center">
          <div className="mt-1 w-full flex justify-end items-center h-fit px-2 gap-1">
            <LogoutButton />
            <LocaleSwitcher />
          </div>
          <NewNav />
          <NeedAuth>
            <Wrapper>{children}</Wrapper>
          </NeedAuth>
        </div>{" "}
      </QueryClientProvider>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 0px;
`;
