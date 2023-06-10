import Link from "next/link";
import React from "react";

export const NavButton = ({
  isActive,
  text,
  pass,
}: {
  isActive: boolean;
  text: string;
  pass: string;
}) => {
  return (
    <Link
      className={`${
        isActive
          ? "border-main shadow-around shadow-main bg-main text-white"
          : "text-sub border-transparent"
      } max-w-[5rem] border-solid border rounded-full flex items-center justify-center px-2 text-[14px] transition hover:bg-main hover:text-white`}
      href={pass}
      passHref
    >
      {text}
    </Link>
  );
};
