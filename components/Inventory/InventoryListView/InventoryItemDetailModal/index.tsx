import { Dialog, Transition } from "@headlessui/react";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  clickToCopyToClipboard,
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
  getLocationBGColor,
  myCopyImageToClipboard,
  parseItemCode,
} from "../../../../lib/utility";
import {
  forDetailItemAtom,
  showInventoryItemDetailAtom,
} from "../../../../store/inventory";
import { customBounce } from "../../../../styles/animation";
import { CapsuleBadge } from "../../../../styles/atoms/CapsuleBadge";
import { PhItem } from "../../../../type";
import { CustomImage } from "../../../Image";
import { Operations } from "./Operations";
import { phItemStore } from "../../../../lib/cache";

export const InventoryItemDetailModal = () => {
  const { t } = useTranslation("inventory");
  const [isOpen, setIsOpen] = useAtom(showInventoryItemDetailAtom);
  const item = useAtomValue(forDetailItemAtom);
  const [phItem, setPhItem] = useState<PhItem | undefined>(undefined);
  const closeModal = () => {
    setIsOpen(false);
  };
  const [itemCode, size, color] = parseItemCode(item?.itemCodeExt);

  const handleImageOnClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    try {
      await myCopyImageToClipboard(`${itemCode}_${color}.jpeg`);
    } catch (err) {
      toast.error("コピーが失敗しました");
      return;
    }
    toast.success("コピーしました", {
      position: toast.POSITION.BOTTOM_CENTER,
      transition: customBounce,
    });
  };
  useEffect(() => {
    phItemStore.getOne(itemCode).then(setPhItem);
    return () => {
      setPhItem(undefined);
    };
  }, [itemCode]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={closeModal}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all p-3 sm:my-8 sm:align-middle sm:max-w-xl w-full">
              <div className="bg-white lg:p-2">
                <div className="flex flex-col lg:flex-row w-full items-center justify-center gap-4">
                  <div className="flex lg:flex-col gap-2 items-center justify-center">
                    <div>
                      <CustomImage
                        itemCode={itemCode}
                        width={100}
                        colorNo={parseInt(color)}
                        onClick={handleImageOnClick}
                      />
                    </div>
                    <div>
                      {phItem
                        ? convertToJPYCurrencyFormatString(
                            convertWithTaxPriceToWithOutTaxPrice(phItem?.price)
                          )
                        : null}
                    </div>
                    <div className="flex gap-1 items-center justify-center">
                      <div
                        onClick={clickToCopyToClipboard}
                        className="cursor-pointer"
                      >
                        {itemCode}
                      </div>
                      {size !== "9" ? <div>{size}</div> : null}
                      <div className="border-solid border-[1px] border-black rounded-[50%] text-center py-1 px-2 ">
                        {color}
                      </div>
                    </div>
                    <div className="hidden md:flex w-full items-center justify-center gap-1">
                      {item?.quantity.reduce(
                        (total, quantity) => (total += quantity.quantity),
                        0
                      ) === 0 ? (
                        <CapsuleBadge>在庫なし</CapsuleBadge>
                      ) : (
                        item?.quantity.map((quantity) => {
                          if (quantity.quantity === 0) return null;
                          return (
                            <CapsuleBadge
                              key={quantity.location}
                              background={getLocationBGColor(quantity.location)}
                            >
                              {t(`location.${quantity.location}`)}{" "}
                              {quantity.quantity}
                            </CapsuleBadge>
                          );
                        })
                      )}
                    </div>
                    <div className="flex md:hidden w-full items-center justify-center gap-1">
                      {item?.quantity.reduce(
                        (total, quantity) => (total += quantity.quantity),
                        0
                      ) === 0 ? (
                        <CapsuleBadge>在庫なし</CapsuleBadge>
                      ) : (
                        item?.quantity.map((quantity) => {
                          if (quantity.quantity === 0) return null;
                          return (
                            <CapsuleBadge
                              key={quantity.location}
                              background={getLocationBGColor(quantity.location)}
                              minWidth="20px"
                            >
                              {quantity.quantity}
                            </CapsuleBadge>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <Operations itemCodeExt={item?.itemCodeExt!} />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
