import React, { useMemo } from "react";
import { Audio } from "ts-audio";
//@ts-ignore
import Ok from "../../public/ok.mp3";
//@ts-ignore
import Ok2 from "../../public/ok2.mp3";
//@ts-ignore
import Ng from "../../public/ng.mp3";
type SoundFile = "ok" | "ok2" | "ng";

export default function useSound({ toPlay }: { toPlay: SoundFile }) {
  const file = useMemo(() => {
    switch (toPlay) {
      case "ok":
        return Ok;
      case "ok2":
        return Ok2;
      case "ng":
        return Ng;
    }
  }, [toPlay]);
  const audio = useMemo(() => Audio({ file }), [file]);

  return [() => audio.play()];
}
