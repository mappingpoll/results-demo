import { h } from "preact";
import { Text } from "preact-i18n";
import { useState } from "preact/hooks";
import { useMobileContext } from "../context/mobile-context";
import style from "./collapsible-section.css";

export default function CollapsibleSection({
  collapsedInitially = true,
  children,
  title,
}) {
  const isMobile = useMobileContext();
  const [isCollapsed, setIsCollapsed] = useState(collapsedInitially);
  return (
    <section
      class={isCollapsed ? style.collapsed : style.open}
      onclick={() => setIsCollapsed(!isCollapsed)}
    >
      <div class={style.title}>
        <h1>{title}</h1>
        {!isMobile && (
          <span>
            <Text id="results.knobs.clickto">Click to show / hide</Text>
          </span>
        )}
      </div>
      {!isCollapsed && children}
    </section>
  );
}
