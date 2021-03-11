import { h } from "preact";

import { IntlProvider } from "preact-i18n";
import frDefinition from "./i18n/fr.json";

// Code-splitting is automated for `routes` directory
import Results from "./routes/results";
import { useState } from "preact/hooks";
import { MobileContextProvider } from "./components/mobile-context";
import { Language } from "./components/language-context";
import "./style";

function getDefinition(lang) {
  return lang === "fr" ? frDefinition : {};
}
let userLang =
  typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";

export default function App() {
  let [definition, setDefinition] = useState(getDefinition(userLang));

  function swapLang(lang = "en") {
    if (userLang === "en") {
      userLang = "fr";
    } else {
      userLang = lang;
    }
    setDefinition(getDefinition(userLang));
  }
  return (
    <IntlProvider definition={definition}>
      <Language.Provider value={userLang}>
        <MobileContextProvider>
          <div id="app">
            <Results swapLang={swapLang} />
          </div>
        </MobileContextProvider>
      </Language.Provider>
    </IntlProvider>
  );
}
