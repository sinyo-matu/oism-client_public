import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { privateApiCall } from "../../../../lib/utility";
import { AppError } from "../../../../type/error";
import { Shipment } from "../../../../type/shipment";

const updateNote = async (shipmentId: string, note: string) => {
  await privateApiCall(
    `/shipment/${shipmentId}/note`,
    "PATCH",
    JSON.stringify({ note })
  ).catch((err) => {
    console.log(err);
    throw err;
  });
};

export const Note = ({
  shipment,
  setShipment,
}: {
  shipment: Shipment;
  setShipment: React.Dispatch<React.SetStateAction<Shipment>>;
}) => {
  const { t } = useTranslation("message");
  const [note, setNote] = useState(shipment.note);
  const [noteOnFocus, setNoteOnFocus] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  //TODO need a refresh signal
  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNote(value);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(async () => {
        setShipment({ ...shipment, note: value });
        try {
          await updateNote(shipment.id, value);
        } catch (err) {
          switch (err) {
            case AppError.PermissionNotEnough:
              toast.error(
                t("common.error.permissionNotEnough", {
                  ns: "message",
                })
              );
              break;
            default:
              toast.error(t("common.error.changeFailed"));
          }
        }
      }, 2000)
    );
  };

  return (
    <>
      {noteOnFocus || note.length === 0 ? (
        <input
          value={note}
          onChange={handleOnChange}
          onFocus={() => setNoteOnFocus(true)}
          onBlur={() => setNoteOnFocus(false)}
          className=" text-[1rem] w-[350px] lg:w-full bg-sub border-none text-default outline-none cursor-pointer focus:cursor-text"
        />
      ) : (
        <span
          className="  break-all text-default"
          onClick={() => setNoteOnFocus(true)}
        >
          {note}
        </span>
      )}
    </>
  );
};
