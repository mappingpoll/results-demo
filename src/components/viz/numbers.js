import { h } from "preact";
import { useD3 } from "../../hooks/useD3";
import { VIEWBOX } from "../../constants";
import { appendAxes } from "./scatterplot-axes";
import { appendLabel } from "./labels";
import "./viz.css";
import {
  countGraphRegions,
  inStandardColumnSet,
} from "../../lib/data-manipulation";

export default function Numbers({ state, columns }) {
  let [x, y] = columns;

  let counts;
  if (inStandardColumnSet(state.standardColumnSet, columns))
    counts = state.standardRegionCounts[x];
  else counts = countGraphRegions(state.processedRawData, columns);
  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();
      // draw axes, columns
      appendAxes(svg);

      // add numbers
      // origin
      appendLabel(svg, counts.origin, 0, 0);
      // quadrants
      const getQuadrantTotal = quadrant =>
        counts.quadrants[quadrant] + counts.outerQuadrants[quadrant];
      const nw = getQuadrantTotal("nw");
      const ne = getQuadrantTotal("ne");
      const se = getQuadrantTotal("se");
      const sw = getQuadrantTotal("sw");
      appendLabel(svg, nw, -5, 5);
      appendLabel(svg, ne, 5, 5);
      appendLabel(svg, se, 5, -5);
      appendLabel(svg, sw, -5, -5);

      // axes
      const getAxisTotal = cardinal =>
        counts.axes[cardinal] + counts.outerAxes[cardinal];
      const n = getAxisTotal("n");
      const e = getAxisTotal("e");
      const s = getAxisTotal("s");
      const w = getAxisTotal("w");
      appendLabel(svg, n, 0, 5);
      appendLabel(svg, e, 5, 0);
      appendLabel(svg, s, 0, -5);
      appendLabel(svg, w, -5, 0);
    },
    [state.standardRegionCounts, columns]
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
