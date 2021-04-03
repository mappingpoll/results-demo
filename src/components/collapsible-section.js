import { h } from "preact";
// import { Text } from "preact-i18n";
import { useEffect, useState } from "preact/hooks";
// import { useMobileContext } from "../context/mobile-context";
import style from "./collapsible-section.css";

export default function CollapsibleSection({
  collapsedInitially = true,
  children,
  title,
  collapseOverride,
}) {
  // const isMobile = useMobileContext();
  const [isCollapsed, setIsCollapsed] = useState(collapsedInitially);

  useEffect(() => {
    if (collapseOverride) setIsCollapsed(true);
  }, [collapseOverride]);

  return (
    <section class={isCollapsed ? style.collapsed : style.open}>
      <div class={style.title} onclick={() => setIsCollapsed(!isCollapsed)}>
        <h1>{title}</h1>
        {/* {!isMobile && (
          <span>
            <Text id="results.knobs.clickto">Click to show / hide</Text>
          </span>
        )} */}
      </div>
      {!isCollapsed && children}
    </section>
  );
}
