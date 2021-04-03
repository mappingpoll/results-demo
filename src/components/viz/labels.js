import { xScale, yScale } from "../../lib/scales";

export function appendLabel(svg, textContent, x, y) {
  const label = svg
    .append("g")
    .attr("transform", `translate(${xScale(x)}, ${yScale(y)})`);

  label
    .append("text")
    .text(textContent)
    .style("stroke", "white")
    .style("stroke-width", "20px");
  label.append("text").text(textContent).style("fill", "black");
}
