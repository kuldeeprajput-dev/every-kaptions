"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:bg-amber focus:text-[#0c0b0a] focus:font-semibold focus:rounded-full focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-[100] bg-[rgba(12,11,10,0.82)] backdrop-blur-[12px] border-b border-[var(--hairline)] overflow-visible">
        <div className="w-full max-w-none px-[var(--page-gutter)] py-[14px] flex items-center justify-between gap-4 max-[420px]:py-3 max-[420px]:gap-2">
          <Link
            className="inline-flex items-center gap-2.5 no-underline flex-nowrap text-inherit shrink-0 overflow-visible max-[420px]:gap-1.5"
            href="/"
            aria-label="Replix Captions homepage"
          >
            <svg
              className="block h-[calc(24px*34/28)] w-[calc(24px*268/28)] min-w-[calc(24px*268/28)] shrink-0 max-[480px]:h-[calc(22px*34/28)] max-[480px]:w-[calc(22px*268/28)] max-[480px]:min-w-[calc(22px*268/28)] max-[420px]:h-[calc(20px*34/28)] max-[420px]:w-[calc(20px*268/28)] max-[420px]:min-w-[calc(20px*268/28)] max-[360px]:h-[calc(18px*34/28)] max-[360px]:w-[calc(18px*268/28)] max-[360px]:min-w-[calc(18px*268/28)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -3 268 34"
              width="230"
              height="29"
              role="img"
              aria-label="Replix Captions"
            >
              <path
                fill="#f4ecdc"
                d="M376 594H185V402H372Q424 402 454 432Q481 459 481 498Q481 537 455 564Q425 594 376 594ZM605 0H458V185Q458 240 429 261Q404 281 345 281H185V0H38V719H403Q510 719 573 653Q629 594 629 511Q629 454 601 410Q571 363 517 344Q569 327 589 290Q605 260 605 203Z"
                transform="translate(0.00,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f4ecdc"
                d="M374 318Q369 372 337.5 403.0Q306 434 265 434Q225 434 196 405Q164 374 156 318ZM518 229H151Q156 163 193 127Q225 97 271 97Q305 97 332.0 113.0Q359 129 367 156H511Q487 75 425.0 30.5Q363 -14 278 -14Q11 -14 11 277Q11 400 78.5 473.5Q146 547 268 547Q518 547 518 229Z"
                transform="translate(24.09,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f4ecdc"
                d="M403 262Q403 426 282 426Q164 426 164 254Q164 182 201 139Q235 100 283 100Q332 100 365 140Q403 185 403 262ZM548 262Q548 148 497 73Q438 -13 329 -14H328Q230 -14 173 70H171V-186H31V533H167V491Q167 467 168 466Q169 467 169 467Q219 549 317 549Q384 549 441.5 509.0Q499 469 523.5 407.5Q548 346 548 262Z"
                transform="translate(44.00,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f4ecdc"
                d="M175 0H34V719H175Z"
                transform="translate(65.06,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f4ecdc"
                d="M175 0H34V533H175ZM175 596H34V727H175Z"
                transform="translate(72.66,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f4ecdc"
                d="M533 0H361L267 160L176 0H8L187 271L13 533H183L273 377L363 533H527L351 271Z"
                transform="translate(80.41,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M664 246Q633 83 507 16Q440 -20 354 -20Q260 -20 184.5 21.0Q109 62 65.5 145.0Q22 228 22 351Q22 449 50 526Q99 663 220 713Q283 738 356 738Q442 738 510 704Q649 636 664 482H513Q498 543 454.5 576.0Q411 609 358 609Q272 609 223.0 540.0Q174 471 174 359Q174 262 212 195Q258 111 349 111Q483 111 513 246Z"
                transform="translate(102.56,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M344 260Q323 243 270 233Q210 222 192 212Q155 193 155 146Q155 86 218 86Q247 86 278.0 99.5Q309 113 325 132Q346 158 346 209Q346 218 345.0 235.0Q344 252 344 260ZM493 0H362Q356 11 349 43Q300 -11 193 -11Q119 -11 71 23Q15 63 15 139Q15 248 100 289Q139 308 259 323Q344 334 344 369Q344 400 318.5 418.5Q293 437 259 437Q224 437 199 418Q171 397 167 359H33Q38 424 63.5 464.0Q89 504 146 526Q199 546 266 546Q493 544 493 329Z"
                transform="translate(127.79,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M403 262Q403 426 282 426Q164 426 164 254Q164 182 201 139Q235 100 283 100Q332 100 365 140Q403 185 403 262ZM548 262Q548 148 497 73Q438 -13 329 -14H328Q230 -14 173 70H171V-186H31V533H167V491Q167 467 168 466Q169 467 169 467Q219 549 317 549Q384 549 441.5 509.0Q499 469 523.5 407.5Q548 346 548 262Z"
                transform="translate(147.40,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M458 271Q458 192 450 150Q438 81 403 42Q346 -20 243 -20Q179 -20 127 7Q70 37 46 90Q25 139 25 199V676H165V533H458V432H165V213Q165 172 171 151Q185 103 245 103Q280 103 299 124Q327 154 327 253V350H458Z"
                transform="translate(168.45,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M175 0H34V533H175ZM175 596H34V727H175Z"
                transform="translate(186.24,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M418 266Q418 428 290 428Q161 428 161 266Q161 104 290 104Q418 104 418 266ZM561 266Q561 139 488.0 62.5Q415 -14 290 -14Q163 -14 89.5 63.5Q16 141 16 266Q16 392 89.0 469.5Q162 547 290 547Q418 547 491 468Q561 391 561 266Z"
                transform="translate(193.99,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M515 0H374V322Q374 378 357 401Q336 428 282 428Q173 428 173 305V0H32V533H167V483Q167 454 168 454Q168 455 169 455Q194 499 240.5 523.5Q287 548 339 548Q445 548 493 465Q515 425 515 369Z"
                transform="translate(215.76,26.00) scale(0.038,-0.038)"
              />
              <path
                fill="#f6c453"
                d="M505 170Q505 113 477 71Q417 -16 269 -16Q168 -16 96 30Q16 82 15 170H160Q160 131 194 109Q224 90 268 90Q307 90 335.5 105.5Q364 121 364 146Q364 179 279 198Q153 227 120 243Q35 284 35 369Q35 419 59.0 460.0Q83 501 140.0 525.5Q197 550 263 550Q353 550 414 507Q484 459 489 371H350Q339 442 256 442Q222 442 197.0 427.0Q172 412 172 389Q172 359 258 340Q383 312 419 295Q505 253 505 170Z"
                transform="translate(236.13,26.00) scale(0.038,-0.038)"
              />
            </svg>
          </Link>
          <nav
            className="flex items-center gap-3.5 shrink-0 max-[480px]:gap-1.5 max-[420px]:gap-1 max-[420px]:ml-auto"
            aria-label="Main navigation"
          >
            <Link
              href="/pricing"
              aria-current={pathname === "/pricing" ? "page" : undefined}
              className={cn(
                "font-semibold text-[13px] px-3 py-2.5 min-h-[44px] inline-flex items-center transition-colors duration-150 max-[480px]:px-2 max-[480px]:text-xs max-[420px]:px-1.5 max-[420px]:min-h-[40px] max-[360px]:hidden",
                pathname === "/pricing"
                  ? "text-cream"
                  : "text-amber hover:text-cream"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/roadmap"
              aria-current={pathname === "/roadmap" ? "page" : undefined}
              className={cn(
                "font-semibold text-[13px] px-3 py-2.5 min-h-[44px] inline-flex items-center transition-colors duration-150 max-[480px]:px-2 max-[480px]:text-xs max-[420px]:px-1.5 max-[420px]:min-h-[40px] max-[420px]:hidden",
                pathname === "/roadmap"
                  ? "text-cream"
                  : "text-amber hover:text-cream"
              )}
            >
              Roadmap
            </Link>
            <Link
              href="/support"
              aria-current={pathname === "/support" ? "page" : undefined}
              className={cn(
                "font-semibold text-[13px] px-3 py-2.5 min-h-[44px] inline-flex items-center transition-colors duration-150 max-[480px]:px-2 max-[480px]:text-xs max-[480px]:hidden",
                pathname === "/support"
                  ? "text-cream"
                  : "text-amber hover:text-cream"
              )}
            >
              Support
            </Link>
            <Link
              href="/editor"
              className="btn-open-app inline-flex items-center justify-center box-border no-underline bg-cream !text-[#0c0b0a] text-[13px] font-semibold rounded-full cursor-pointer px-[18px] min-h-[44px] shadow-[var(--gold-glow)] hover:-translate-y-px hover:shadow-[var(--gold-glow-hover)] transition-[transform,box-shadow] duration-150 whitespace-nowrap max-[420px]:min-h-[40px] max-[420px]:px-3.5 max-[420px]:text-xs max-[360px]:px-2.5"
            >
              Open app
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
