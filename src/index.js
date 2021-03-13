import { h } from "preact";

import { LanguageContextProvider } from "./context/language-context";
import { MobileContextProvider } from "./context/mobile-context";
import Results from "./components/results";
import "./style.css";

export default function App() {
  return (
    <LanguageContextProvider>
      <MobileContextProvider>
        <div id="app">
          <Results />
        </div>
      </MobileContextProvider>
    </LanguageContextProvider>
  );
}
