import { h } from "preact";
import { useD3 } from "../../hooks/useD3";
import { VIEWBOX } from "../../constants";
import { appendAxes } from "./scatterplot-axes";
import { appendLabel } from "./labels";
import "./viz.css";

export default function Numbers({ numbers, columns }) {
  let [x, y] = columns;
  const counts = numbers[x]; // same as numbers[y]
  console.log(counts);
  const ref = useD3(
    svg => {
      // draw axes, columns
      appendAxes(svg);

      // add numbers
      // origin
      appendLabel(svg, counts.origin, 0, 0);
    },
    [columns]
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
