import { useAtom } from "jotai";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Color } from "../../../../styles/Color";
import { Order } from "../../../../type/order";
import { shipmentItemSuggestionSignalAtom } from "../../../../store/newShipment";
import { privateApiCall } from "../../../../lib/utility";

const updateNote = async (orderId: string, note: string) => {
  await privateApiCall(
    `/orders/${orderId}/note`,
    "PATCH",
    JSON.stringify({ note })
  ).catch((err) => {
    console.log(err);
    throw err;
  });
};

export const Note = ({
  order,
  setOrder,
}: {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}) => {
  const [note, setNote] = useState(order.note);
  const [noteLength, setNoteLength] = useState(order.note.length);
  const [noteOnFocus, setNoteOnFocus] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [newShipmentsSuggestionSignal, sendShipmentsSuggestionSignal] = useAtom(
    shipmentItemSuggestionSignalAtom
  );

  //TODO need a refresh signal
  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNote(value);
    setNoteLength(value.length);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setOrder({ ...order, note: value });
        try {
          updateNote(order.id, value);
        } catch (err) {
          toast.error("ノート更新が失敗しました");
        }
        sendShipmentsSuggestionSignal(newShipmentsSuggestionSignal + 1);
      }, 2000)
    );
  };

  return (
    <NoteWrapper noteOnFocus={noteOnFocus} hasNote={noteLength !== 0}>
      <NoteCell
        charLength={noteLength}
        hasNote={noteLength !== 0}
        noteOnFocus={noteOnFocus}
        value={note}
        onChange={handleOnChange}
        onFocus={() => setNoteOnFocus(true)}
        onBlur={() => setNoteOnFocus(false)}
      />
    </NoteWrapper>
  );
};

interface WrapperProps {
  noteOnFocus: boolean;
  hasNote: boolean;
}

const NoteWrapper = styled.div<WrapperProps>`
  flex-grow: 1;
  position: relative;
  &:before {
    content: "✒︎";
    color: ${(props) =>
      props.noteOnFocus || props.hasNote ? Color.MAIN : Color.Default};
    position: absolute;
    left: 5px;
    top: 46%;
    transform: translateY(-50%);
    z-index: 1;
    transition: 0.5s;
  }
`;

interface NoteProps {
  charLength: number;
  hasNote: boolean;
  noteOnFocus: boolean;
}
const NoteCell = styled.input<NoteProps>`
  font-size: 1rem;
  width: 100%;
  background-color: ${Color.SUB};
  border: none;
  color: ${Color.Default};
  padding: 2px 2px 2px 20px;
  outline: none;
  cursor: pointer;
  &:focus {
    cursor: text;
  }
  transition: 0.2s;
`;
