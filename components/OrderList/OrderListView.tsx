import React, { Suspense } from "react";
import { ConcealAlertModal } from "./ConcealAlertModal";
import { DeleteAlertModal } from "./DeleteAlertModal";
import { OrderListItemWrapper } from "./OrderListItemWrapper";
import { UpdateOrderItemRateModal } from "./UpdateOrderItemRateModal";

export const OrderListView = () => {
  return (
    <>
      <Suspense fallback={""}>
        <OrderListItemWrapper />
      </Suspense>
      <DeleteAlertModal />
      <ConcealAlertModal />
      <UpdateOrderItemRateModal />
    </>
  );
};
