/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import OISM_Logo from "../public/oism-logo.png";
import Image from "next/legacy/image";
import Link from "next/link";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";
import { ConnectionBadge } from "./ConnectionBadge";
import { useTranslation } from "next-i18next";

export default function Example() {
  const { pathname } = useRouter();
  const { t } = useTranslation("nav");
  return (
    <Popover className="w-full z-20 sticky top-0 min-h-[56px] bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-2 lg:justify-start lg:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" passHref>
              <Image
                src={OISM_Logo}
                alt="logo"
                width={35}
                height={35}
                objectFit="contain"
                className="h-2/5 m-auto"
              />
            </Link>
          </div>
          <div className="-mr-2 -my-2 lg:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sub">
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="hidden lg:flex  justify-between items-center px-4 py-1.5 bg-default border border-solid border-sub rounded-full hover:shadow-aroundMini hover:shadow-sub transition duration-500 space-x-5">
            <Popover.Group as="nav" className="hidden lg:flex space-x-2">
              <NavButton
                isActive={pathname === "/"}
                pass="/"
                text={t("orderList")}
              />
              <NavButton
                isActive={pathname === "/inventory"}
                pass="/inventory"
                text={t("inventory")}
              />
              <NavButton
                isActive={pathname === "/shipment"}
                pass="/shipment"
                text={t("shipment")}
              />
              <NavButton
                isActive={pathname === "/registerList"}
                pass="/registerList"
                text={t("registerList")}
              />
              <NavButton
                isActive={pathname === "/returnList"}
                pass="/returnList"
                text={t("returnList")}
              />
              <NavButton
                isActive={pathname === "/transferList"}
                pass="/transferList"
                text={t("transferList")}
              />
            </Popover.Group>
            <Popover.Group as="nav" className="hidden md:flex space-x-2">
              <NavButton
                isActive={pathname === "/newOrder"}
                pass="/newOrder"
                text={t("newOrder")}
              />
              <NavButton
                isActive={pathname === "/newRegister"}
                pass="/newRegister"
                text={t("newRegister")}
              />
              <NavButton
                isActive={pathname === "/newShipment"}
                pass="/newShipment"
                text={t("newShipment")}
              />
              <NavButton
                isActive={pathname === "/newReturn"}
                pass="/newReturn"
                text={t("newReturn")}
              />
              <NavButton
                isActive={pathname === "/newTransfer"}
                pass="/newTransfer"
                text={t("newTransfer")}
              />
            </Popover.Group>
          </div>
          <div className="hidden lg:flex items-center justify-end lg:flex-1 lg:w-0">
            <ConnectionBadge />
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute z-50 top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden"
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <Link href="/" passHref>
                  <Image
                    src={OISM_Logo}
                    alt="logo"
                    width={35}
                    height={35}
                    objectFit="contain"
                    className="h-2/5 m-auto"
                  />
                </Link>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sub">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div className="grid justify-items-center grid-cols-2 gap-y-4 gap-x-8">
                <NavButton
                  isActive={pathname === "/"}
                  pass="/"
                  text={t("orderList")}
                />
                <NavButton
                  isActive={pathname === "/inventory"}
                  pass="/inventory"
                  text={t("inventory")}
                />
                <NavButton
                  isActive={pathname === "/shipment"}
                  pass="/shipment"
                  text={t("shipment")}
                />
                <NavButton
                  isActive={pathname === "/registerList"}
                  pass="/registerList"
                  text={t("registerList")}
                />
                <NavButton
                  isActive={pathname === "/returnList"}
                  pass="/returnList"
                  text={t("returnList")}
                />
                <NavButton
                  isActive={pathname === "/transferList"}
                  pass="/transferList"
                  text={t("transferList")}
                />
              </div>
              <div className="grid justify-items-center grid-cols-2 gap-y-4 gap-x-8">
                <NavButton
                  isActive={pathname === "/newOrder"}
                  pass="/newOrder"
                  text={t("newOrder")}
                />
                <NavButton
                  isActive={pathname === "/newRegister"}
                  pass="/newRegister"
                  text={t("newRegister")}
                />
                <NavButton
                  isActive={pathname === "/newShipment"}
                  pass="/newShipment"
                  text={t("newShipment")}
                />
                <NavButton
                  isActive={pathname === "/newReturn"}
                  pass="/newReturn"
                  text={t("newReturn")}
                />
                <NavButton
                  isActive={pathname === "/newTransfer"}
                  pass="/newTransfer"
                  text={t("newTransfer")}
                />
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
