import { h } from "preact";
import style from "./collapsible-section.css";

export default function CollapsibleSection({ children, title, cb, isOpen }) {
  return (
    <section class={isOpen ? style.open : style.collapsed}>
      <div class={style.title} onclick={cb}>
        <h1>{title}</h1>
        <h1>
          <strong>{!isOpen ? "+" : "−"}</strong>
        </h1>
      </div>
      {isOpen && children}
      {isOpen && (
        <h1 style="text-align: right; cursor: pointer;" onclick={cb}>
          <strong>−</strong>
        </h1>
      )}
    </section>
  );
}
