import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fa"],
  defaultLocale: "en",
  localePrefix: "always"
});

export const config = {
  matcher: ["/", "/(en|fa)/:path*", "/((?!api|_next|.*\\..*).*)"]
};

