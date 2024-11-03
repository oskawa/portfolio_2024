"use client";
import Link from "next/link";
import { useRouter } from "next/router"; 
// import { useLocale, usePathname } from 'next-intl/client'; // client-side intl hooks

const LanguageSwitcher = () => {
  // const locale = useLocale();
  // const pathname = usePathname();
  const locales = ['fr', 'en'];
 
  if (!locales) {
    return null; // Or some fallback UI
  }
  return (
    <div>
      {locales.map((lng) => {
        if (lng === locale) return null; // Skip the current language
        return (
          <Link key={lng} href={asPath} locale={lng}>
            <button>{lng === "fr" ? "Français" : "English"}</button>
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
