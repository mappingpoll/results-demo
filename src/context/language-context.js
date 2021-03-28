import { h, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import { IntlProvider } from "preact-i18n";

import frDefinition from "../i18n/fr.json";

function getDefinition(lang) {
  return lang === "fr" ? frDefinition : {};
}

let userLang =
  typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";

export const Language = createContext();

export function LanguageContextProvider({ children }) {
  let [definition, setDefinition] = useState(getDefinition(userLang));
  function swapLang(lang) {
    if (lang == null) {
      userLang = userLang === "en" ? "fr" : "en";
    } else {
      userLang = lang;
    }
    setDefinition(getDefinition(userLang));
  }
  return (
    <IntlProvider definition={definition}>
      <Language.Provider value={{ userLang, swapLang }}>
        {children}
      </Language.Provider>
    </IntlProvider>
  );
}

export function useLanguageContext() {
  const context = useContext(Language);
  if (context == null) {
    throw new Error(
      "useLanguageContext must be used with a LanguageContextProvider"
    );
  }
  return context;
}
