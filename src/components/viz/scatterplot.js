import { h } from "preact";
import { useD3 } from "../../hooks/useD3";
import { VIEWBOX } from "../../constants";
import { xScale, yScale } from "../../lib/scales";
import { appendAxes } from "./scatterplot-axes";
import { brushFn, isValidDatum, makeBrushTool } from "../../lib/viztools";
import { useMobileContext } from "../../context/mobile-context";
import style from "./viz.css";

export default function Scatterplot({
  data,
  columns,
  options,
  brushMap,
  dispatch,
}) {
  let [x, y] = columns;
  const isMobile = useMobileContext();
  const hasBrushing = Object.keys(brushMap).length > 0;

  function getClasses(d) {
    let classes = style.dot;
    if (hasBrushing) {
      classes += brushMap[d.id] ? ` ${style.brushed}` : ` ${style.notbrushed}`;
    }
    return classes;
  }

  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();
      // append dots
      svg
        .append("g")
        .selectAll("path")
        // filter out NAs
        .data(data.filter(d => isValidDatum(d, columns)))
        .join("path")
        .attr("stroke-width", options.size)
        .attr("stroke-opacity", options.opacity)
        .attr("class", getClasses)
        .attr("d", d => `M${xScale(d[x])}, ${yScale(d[y])}h0`);

      // draw axes, columns
      appendAxes(svg);

      // add brushing on desktop
      if (!isMobile)
        svg.append("g").call(makeBrushTool(brushFn(data, columns, dispatch)));
    },
    [data, columns, brushMap, options.size, options.opacity]
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
