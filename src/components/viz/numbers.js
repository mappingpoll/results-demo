import { h } from "preact";
import { useD3 } from "../../hooks/useD3";
import { VIEWBOX } from "../../constants";
import { appendAxes } from "./scatterplot-axes";
import { appendLabel } from "./labels";
import "./viz.css";

export default function Numbers({ numbers, columns }) {
  let [x, y] = columns;
  const counts = numbers[x]; // same as numbers[y]
  const ref = useD3(
    svg => {
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
    [numbers, columns]
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
