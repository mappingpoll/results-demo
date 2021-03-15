import { h } from "preact";
import { geoPath } from "d3";
import { useD3 } from "../../hooks/useD3";
import { VIEWBOX } from "../../constants";
import { appendAxes } from "./scatterplot-axes";
import style from "./viz.css";
import { computeDensity } from "../../lib/viztools";

export default function ContourChart({ data, columns, options }) {
  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();

      // compute the density data
      const densityData = computeDensity(
        data,
        options.contourBandwidth,
        columns
      );

      // Add the contour
      svg
        .append("g")
        .selectAll("path")
        .data(densityData)
        .enter()
        .append("path")
        .attr("class", style.contourPath)
        .attr("d", geoPath());

      // draw axes, columns
      appendAxes(svg);
    },
    [data, columns, options.contourBandwidth]
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
