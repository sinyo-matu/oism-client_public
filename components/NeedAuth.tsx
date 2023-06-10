import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { PRIVATE_URL } from "../lib/utility";

export const NeedAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const routerRef = useRef(router);
  const [renderNext, setRenderNext] = useState(false);
  useEffect(() => {
    const call = async () => {
      const res = await fetch(`${PRIVATE_URL}/health_check`, {
        method: "GET",
        credentials: "same-origin",
      });
      if (!res) {
        routerRef.current.push("/offline");
        return;
      }
      if (res.status === 401) {
        routerRef.current.push("/login");
        return;
      }
      setRenderNext(true);
    };
    call();
    return () => setRenderNext(false);
  }, []);
  if (!renderNext) return null;
  return <>{children}</>;
};
