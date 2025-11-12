/** @file Configures i18next with Fluent resources and browser detection. */

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Fluent from "i18next-fluent";
import FluentBackend from "i18next-fluent-backend";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./app/i18n/supported-locales";

const supportedLngs = SUPPORTED_LOCALES.map((locale) => locale.code);

type AjaxResponse = {
  status: number;
  statusText?: string;
};

interface AjaxOptions {
  body?: BodyInit | null;
  headers?: Record<string, string>;
  method?: string;
  withCredentials?: boolean;
}

const fetchAjax = (
  url: string,
  options: AjaxOptions = {},
  callback: (data: string | Error, xhr: AjaxResponse) => void,
): void => {
  const { body, headers, method, withCredentials } = options;

  const request: RequestInit = {
    credentials: withCredentials ? "include" : "same-origin",
    method: method ?? "GET",
  };

  if (headers) {
    request.headers = headers;
  }

  if (body !== undefined) {
    request.body = body;
  }

  void fetch(url, request)
    .then(async (response) => {
      const text = await response.text();
      callback(text, { status: response.status, statusText: response.statusText });
    })
    .catch((error) => {
      const typedError = error as Error;
      const message = typedError?.message ?? "Unexpected i18n network failure";
      const name = typedError?.name ?? "Error";

      let status = 500;
      if (name === "AbortError") {
        status = 408;
      } else if (typedError instanceof TypeError || /Failed to fetch|NetworkError/u.test(message)) {
        status = 502;
      }

      // eslint-disable-next-line no-console
      console.error("i18next fluent backend fetch failed", typedError);
      callback(typedError, { status, statusText: message });
    });
};

// Initialise immediately so that React components can rely on Suspense to wait for .ftl bundles.
void i18n
  .use(FluentBackend)
  .use(LanguageDetector)
  .use(Fluent)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.ftl",
      ajax: fetchAjax,
    },
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs,
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    returnNull: false,
    i18nFormat: {
      fluentBundleOptions: { useIsolating: false },
    },
  });

export default i18n;

/**@example
 * ```ts
 * import i18n from "../i18n";
 *
 * i18n.changeLanguage("es");
 * ```
 */
