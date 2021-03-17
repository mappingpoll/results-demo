import { h } from "preact";
import { geoPath } from "d3";
import { useD3 } from "../../hooks/useD3";
import { VIEWBOX } from "../../constants";
import { computeDensity, getColorScale } from "../../lib/viztools";
import { appendAxes } from "./scatterplot-axes";
import style from "./viz.css";

export default function ColorContour({ data, columns: columns2d, options }) {
  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();

      // compute the density data
      const densityData = computeDensity(
        data,
        options.contourBandwidth,
        columns2d
      );

      // Prepare a color palette
      const color = getColorScale(
        options.color,
        [
          Math.min(...densityData.map(d => d.value)),
          Math.max(...densityData.map(d => d.value)),
        ],
        options.reverseColor
      );

      // Add the contour
      svg
        .append("g")
        .selectAll("path")
        .data(densityData)
        .enter()
        .append("path")
        .attr("class", style.coutourPath)
        .attr("d", geoPath())
        // .attr("stroke", (_, i) => (i === 0 ? color(1) : "none"))
        .attr("fill", d => color(d.value));

      // draw axes, columns
      appendAxes(svg);
    },
    [
      data,
      columns2d,
      options.color,
      options.contourBandwidth,
      options.reverseColor,
    ]
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
