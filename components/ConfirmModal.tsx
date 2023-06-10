import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "next-i18next";
import React, { Fragment, ReactNode } from "react";
import { Color } from "../styles/Color";
import { ButtonCompo } from "./ButtonCompo";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  infoContent?: ReactNode;
  title: string;
  mainContent?: ReactNode;
  concealText?: string;
  confirmText?: string;
  onConfirmClicked: () => void;
  loading: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirmClicked,
  infoContent,
  mainContent,
  loading,
  title,
  concealText,
  confirmText,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
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
          {/* This element is to trick the browser into centering the modal contents. */}
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
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all p-3 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 flex flex-wrap justify-center gap-1 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  {infoContent}
                </div>
                <Dialog.Title className="text-2xl text-center leading-6 font-medium text-gray-900 mt-2">
                  {title}
                </Dialog.Title>
              </div>

              <div className="w-full flex flex-col items-center">
                {mainContent}
                <div className="my-2 w-full flex justify-around ">
                  <ButtonCompo
                    fontSize="1rem"
                    color={Color.SUB}
                    onClick={onClose}
                    disabled={loading}
                  >
                    {concealText ?? t("conceal")}
                  </ButtonCompo>
                  <ButtonCompo
                    fontSize="1rem"
                    color={Color.Error}
                    onClick={onConfirmClicked}
                    disabled={loading}
                  >
                    {confirmText ?? "OK"}
                  </ButtonCompo>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
