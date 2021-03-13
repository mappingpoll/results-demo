import { h } from "preact";
import { Text } from "preact-i18n";
import { graphType2Component } from "../../lib/misc";
import { questions } from "../../i18n/fr.json";
import style from "./viz.css";

export function Viz({ state, columns, callback }) {
  const { data, colorScale, options, brushMap } = state;
  if (columns == null) return; //columns = state.vizColumns;
  let [x, y] = columns;

  const SVG = graphType2Component(options.graph);

  return (
    <div class={style.vizContainer}>
      <div class={style.viz}>
        <SVG
          data={data}
          columns={columns}
          colorScale={colorScale}
          options={options}
          brushMap={brushMap}
          callback={callback}
        />
      </div>

      <div class={`${style.label} ${style.right}`}>
        <Text id={`questions.${x}.fr.end`}>{questions[x].en.end}</Text>
      </div>
      <div class={`${style.label} ${style.left}`}>
        <Text id={`questions.${x}.fr.start`}>{questions[x].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.bottom}`}>
        <Text id={`questions.${y}.fr.start`}>{questions[y].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.top}`}>
        <Text id={`questions.${y}.fr.end`}>{questions[y].en.end}</Text>
      </div>
    </div>
  );
}
