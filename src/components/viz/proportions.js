import { h } from "preact";
import { useD3 } from "../../hooks/useD3";
import { VIEWBOX } from "../../constants";
import { appendAxes } from "./scatterplot-axes";
import { appendLabel } from "./labels";
import "./viz.css";
import {
  countGraphRegionProportions,
  inStandardColumnSet,
} from "../../lib/data-manipulation";

export default function Proportions({ state, columns }) {
  let [x, y] = columns;

  let proportions;

  if (inStandardColumnSet(state.standardColumnSet, columns))
    proportions = state.standardProportions[x];
  else
    proportions = countGraphRegionProportions(state.processedRawData, columns);

  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();
      // draw axes, columns
      appendAxes(svg);

      // add numbers
      // origin
      appendLabel(svg, `${proportions.origin}%`, 0, 0);
      // quadrants
      const { nw, ne, se, sw } = proportions.quadrants;
      appendLabel(svg, `${ne}%`, 5, 5);
      appendLabel(svg, `${nw}%`, -5, 5);
      appendLabel(svg, `${se}%`, 5, -5);
      appendLabel(svg, `${sw}%`, -5, -5);

      // axes
      const { n, e, s, w } = proportions.axes;
      appendLabel(svg, `${n}%`, 0, 5);
      appendLabel(svg, `${e}%`, 5, 0);
      appendLabel(svg, `${s}%`, 0, -5);
      appendLabel(svg, `${w}%`, -5, 0);
    },
    [state.standardProportions, columns]
  );

  return (
    <>
      <svg
        ref={ref}
        viewBox={VIEWBOX.join(",")}
        width={VIEWBOX[2]}
        height={VIEWBOX[3]}
        style="width: 100%; height: auto;"
      />
    </>
  );
}
