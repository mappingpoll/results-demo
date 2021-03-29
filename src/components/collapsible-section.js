import { h } from "preact";
import { useState } from "preact/hooks";
import style from "./collapsible-section.css";

export default function CollapsibleSection({
  collapsedInitially = true,
  children,
  title,
}) {
  const [isCollapsed, setIsCollapsed] = useState(collapsedInitially);
  return (
    <section
      class={isCollapsed ? style.collapsed : style.open}
      onclick={() => setIsCollapsed(!isCollapsed)}
    >
      <h1>{title}</h1>
      {!isCollapsed && children}
    </section>
  );
}
