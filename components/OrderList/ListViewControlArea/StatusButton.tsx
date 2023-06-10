import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import {
  addQueryOrderItemStatusAtom,
  deleteQueryOrderItemStatusAtom,
} from "../../../store/orderList";
import { OrderItemStatus } from "../../../type/order";
import { ButtonCompo } from "../../ButtonCompo";

export const StatusButton = ({ status }: { status: OrderItemStatus }) => {
  const { t } = useTranslation("orderStatus");
  const [statuses, addStatus] = useAtom(addQueryOrderItemStatusAtom);
  const deleteStatus = useSetAtom(deleteQueryOrderItemStatusAtom);
  const handleOnClick = (
    _event: React.MouseEvent<HTMLButtonElement>,
    _name: string | undefined
  ) => {
    if (!statuses.has(status)) {
      addStatus(status);
      return;
    }
    deleteStatus(status);
  };

  return (
    <ButtonCompo
      fontSize="0.9rem"
      name={status}
      selected={statuses.has(status)}
      onClick={handleOnClick}
    >
      {t(status)}
    </ButtonCompo>
  );
};
