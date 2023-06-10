import Link from "next/link";
import { useRouter } from "next/router";

export default function LocaleSwitcher() {
  const router = useRouter();
  const { locales, locale: activeLocale } = router;
  const otherLocales = locales!.filter((locale) => locale !== activeLocale);

  return (
    <div className="flex h-fit px-2">
      {otherLocales.map((locale) => {
        const { pathname, query, asPath } = router;
        return (
          <Link
            key={locale}
            href={{ pathname, query }}
            as={asPath}
            locale={locale}
            className=" underline text-[4px] h-fit"
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
