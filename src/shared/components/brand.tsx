import Link from "next/link";
import { LogoWordmark } from "./logo-wordmark";

export function Brand({ large = false }: { large?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center overflow-visible"
    >
      <LogoWordmark
        className={
          large ? "w-[240px] max-sm:w-[205px]" : "w-[230px] max-[480px]:w-[211px] max-[420px]:w-[191px] max-[360px]:w-[172px]"
        }
      />
    </Link>
  );
}
