import { useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";
export const useHeightScrollPercentage = (throttleByMs: number) => {
  const [heightScrollPercentage, setHeightScrollPercentage] = useState(0);
  const setHeightScrollPercentageRef = useRef(setHeightScrollPercentage);
  const handlerDocumentResize = () => {
    setHeightScrollPercentageRef.current(
      ((document.documentElement.scrollTop + window.innerHeight) /
        document.documentElement.scrollHeight) *
        100
    );
  };
  const throttledEventHandler = useMemo(
    () => throttle(handlerDocumentResize, throttleByMs),
    [throttleByMs]
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", throttledEventHandler);
      setHeightScrollPercentageRef.current(0);
      return () => {
        window.removeEventListener("scroll", throttledEventHandler);
      };
    }
  }, [throttledEventHandler]);
  return heightScrollPercentage;
};
