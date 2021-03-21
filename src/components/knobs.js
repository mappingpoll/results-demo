import { h } from "preact";
import { Text } from "preact-i18n";
import { useLanguageContext } from "../context/language-context";
// import ColorScaleLegend from "./components/viz/colorScaleLegend/colorScaleLegend";
import { DATASETS, GRAPH_TYPE } from "../constants";
import { hasXAxis } from "../lib/misc";
import style from "./knobs.css";
import { useRef, useState } from "preact/hooks";
// eslint-disable-next-line no-duplicate-imports
import "./knobs.css";

export default function Knobs(props) {
  const { state, dispatch } = props.reducer;

  let [shouldShowKnobs, setShouldShowKnobs] = useState(false);

  function handleShowHideClick() {
    setShouldShowKnobs(!shouldShowKnobs);
  }

  let [wantsChooseRespondents, setWantsChooseRespondents] = useState(false);
  const { swapLang } = useLanguageContext();

  // ALIASES
  const totalRespondents = state.data?.length;
  const graphType = state.options.graph;

  // CONDITIONALS
  const isScatterplot = graphType === GRAPH_TYPE.scatterplot;
  const isHeatmap = graphType === GRAPH_TYPE.heatmap;
  const isNumbers = graphType === GRAPH_TYPE.numbers;
  const isProportions = graphType === GRAPH_TYPE.proportions;
  const isContour = graphType === GRAPH_TYPE.contour;
  const isColorContour = graphType === GRAPH_TYPE.colorContour;

  // const hasColor =
  //   graphType === GRAPH_TYPE.colorContour || graphType === GRAPH_TYPE.heatmap;

  const hasDots =
    graphType === GRAPH_TYPE.scatterplot ||
    graphType === GRAPH_TYPE.contourScatterplot ||
    graphType === GRAPH_TYPE.density;

  // const hasContour =
  //   graphType === GRAPH_TYPE.contourScatterplot ||
  //   graphType === GRAPH_TYPE.colorContour ||
  //   graphType === GRAPH_TYPE.contour;

  const shouldDisableDotSize = !isScatterplot;
  const shouldDisableDotOpacity = shouldDisableDotSize;
  // const shouldDisableColorMid = !wantsColorDimension;
  // const shouldDisableColorSchemeSelect = !hasColor;
  const shouldDisableXAxisSelect = !state.customViz;
  const shouldDisableYAxisSelect =
    !state.customViz || !hasXAxis(state.userAxes);

  // EVENT HANDLERS
  const handleSettingChange = (type, prop, callback = null) => event => {
    dispatch({ type, payload: { [prop]: event.target.value } });
    if (callback != null && typeof callback === "function") callback();
  };

  const handleGraphTypeChange = handleSettingChange(
    "CHANGE_GRAPH_TYPE",
    "graph"
  );
  // const handleColorSchemeChange = handleSettingChange(
  //   "CHANGE_COLOR_SCHEME",
  //   "color"
  // );
  const handleDotSizeChange = handleSettingChange("CHANGE_DOT_SIZE", "size");
  const handleDotOpacityChange = handleSettingChange(
    "CHANGE_DOT_OPACITY",
    "opacity"
  );
  // const handleContourBandwidthChange = handleSettingChange(
  //   "CHANGE_CONTOUR_BANDWIDTH",
  //   "contourBandwidth"
  // );
  const handleWantsCustomGraphClick = handleSettingChange("TOGGLE_CUSTOM");
  // const handleReverseColorClick = handleSettingChange("TOGGLE_REV_COLOR");
  const handleXSelectChange = handleSettingChange("SET_X_AXIS", "x");
  const handleYSelectChange = handleSettingChange("SET_Y_AXIS", "y");

  const handleDatasetChange = event => {
    const clicked = event.target.value;
    let other,
      dataset = { ...state.options.dataset };
    if (DATASETS.form.includes(clicked))
      other = clicked === "aga" ? "ba" : "aga";
    else if (DATASETS.language.includes(clicked))
      other = clicked === "en" ? "fr" : "en";

    dataset[clicked] = !dataset[clicked];
    if (!dataset[clicked] && !dataset[other]) {
      dataset[other] = true;
    }
    dispatch({ type: "FILTER_DATASET", payload: { dataset } });
  };

  const handleResetClick = () => dispatch({ type: "RESET" });

  const ref = useRef();

  // useEffect(() => {
  //   setTimeout(() => setShouldShowKnobs(false), 100);
  // }, []);

  function getKnobsHeight() {
    if (ref.current == null) return 0;
    const node = ref.current;
    const height = Math.floor(
      node.getBoundingClientRect().bottom - node.getBoundingClientRect().top
    );
    return height;
  }
  const knobsHeight = getKnobsHeight();
  return (
    <div
      ref={ref}
      class={style.knobs}
      style={
        shouldShowKnobs
          ? "top: 0;"
          : `margin-top: calc(${-knobsHeight}px - var(--intro--margin-bottom) + var(--knobs--lip-height)); top: calc(var(--knobs--lip-height) - ${knobsHeight}px);`
      }
    >
      <div class={style["lang-swap"]}>
        <a href="#" onclick={() => swapLang()}>
          <Text id="language">Français</Text>
        </a>
      </div>
      <div class={style.knob}>
        <div class={style["labeled-input"]}>
          <label for="graphselect">
            <Text id="results.knobs.graphtype">Graph type</Text>
          </label>
          <select
            id="graphselect"
            name="graphselect"
            onchange={handleGraphTypeChange}
          >
            <option selected={isScatterplot} value={GRAPH_TYPE.scatterplot}>
              <Text id="results.knobs.scatterplot">scatterplot</Text>
            </option>
            <option selected={isHeatmap} value={GRAPH_TYPE.heatmap}>
              <Text id="results.knobs.heatmap">heatmap</Text>
            </option>
            <option selected={isNumbers} value={GRAPH_TYPE.numbers}>
              <Text id="results.knobs.numbers">numbers</Text>
            </option>
            <option selected={isProportions} value={GRAPH_TYPE.proportions}>
              proportions
            </option>
            <option selected={isContour} value={GRAPH_TYPE.contour}>
              <Text id="results.knobs.contour">contour</Text>
            </option>
            <option selected={isColorContour} value={GRAPH_TYPE.colorContour}>
              <Text id="results.knobs.colorContour">topography</Text>
            </option>
          </select>
        </div>
      </div>
      <div class={style.subknob}>
        <div
          class={style["labeled-input"]}
          style={hasDots ? "" : "display: none"}
        >
          <label for="dotsize">
            <Text id="results.knobs.dotsize">Dot size</Text>
          </label>
          <input
            type="range"
            id="dotsize"
            min="1"
            max="90"
            step="0.1"
            name="size"
            value={state.options.size}
            onchange={handleDotSizeChange}
            disabled={shouldDisableDotSize}
          />
        </div>
        <div
          class={style["labeled-input"]}
          style={hasDots ? "" : "display: none"}
        >
          <label for="dotopacity">
            <Text id="results.knobs.dotopacity">Dot opacity</Text>
          </label>
          <input
            type="range"
            id="dotopacity"
            min="0.01"
            max="1"
            step="0.01"
            name="opacity"
            value={state.options.opacity}
            onchange={handleDotOpacityChange}
            disabled={shouldDisableDotOpacity}
          />
        </div>
      </div>
      <div class={style.knob}>
        <input
          type="checkbox"
          id="dataselectors-checkbox"
          checked={wantsChooseRespondents}
          onclick={() => setWantsChooseRespondents(!wantsChooseRespondents)}
        />
        <label for="dataselectors-checkbox">
          <Text id="results.knobs.chooseRespondents">
            Show respondents from...
          </Text>
        </label>
      </div>
      <div
        id="dataselectors"
        class={style.subknob}
        style={wantsChooseRespondents ? "" : "display: none"}
      >
        <div class={style["labeled-checkbox"]}>
          <input
            type="checkbox"
            id="aga"
            name="aga"
            value="aga"
            checked={state.options.dataset.aga}
            onclick={handleDatasetChange}
          />
          <label for="aga">
            <Text id="results.knobs.aga">
              Sobey Art Award Exhibition, Art Gallery of Alberta, Edmonton,
              October 5, 2019 - January 5, 2020
            </Text>
          </label>
        </div>
        <div class={style["labeled-checkbox"]}>
          <input
            type="checkbox"
            id="ba"
            name="ba"
            value="ba"
            checked={state.options.dataset.ba}
            onclick={handleDatasetChange}
          />
          <label for="ba">
            <Text id="results.knobs.ba">
              Exhibition "Positions", Galerie Bradley Ertaskiran, Montreal,
              January 24 - March 7, 2020
            </Text>
          </label>
        </div>
        <div class={style["labeled-checkbox"]}>
          <input
            type="checkbox"
            id="enforms"
            name="en"
            value="en"
            checked={state.options.dataset.en}
            onclick={handleDatasetChange}
          />
          <label for="enforms">
            <Text id="results.knobs.engforms">English questionnaires</Text>
          </label>
        </div>
        <div class={style["labeled-checkbox"]}>
          <input
            type="checkbox"
            id="frforms"
            name="fr"
            value="fr"
            checked={state.options.dataset.fr}
            onclick={handleDatasetChange}
          />
          <label for="frforms">
            <Text id="results.knobs.frforms">French questionnaires</Text>
          </label>
        </div>
      </div>
      <div class={style.knob}>
        <input
          type="checkbox"
          id="customgraphcheckbox"
          value="custom"
          checked={state.customViz}
          onclick={handleWantsCustomGraphClick}
        />
        <label for="customgraphcheckbox">
          <Text id="results.knobs.custom">
            Combine questions into a custom diagram...
          </Text>
        </label>
      </div>
      <div
        id="axesselectors"
        class={style.subknob}
        style={state.customViz ? "" : "display: none"}
      >
        <div class={style["labeled-input"]}>
          <label for="xselect">
            <Text id="results.knobs.horizontal">Horizontal axis</Text>
          </label>
          <select
            id="xselect"
            onchange={handleXSelectChange}
            disabled={shouldDisableXAxisSelect}
          >
            <option value="">
              <Text id="results.knobs.option">choose an option</Text>
            </option>
            {state.questions != null &&
              state.questions.map((option, idx) => (
                <option value={`${idx}`}>{option}</option>
              ))}
          </select>
        </div>
        <div class={style["labeled-input"]}>
          <label for="yselect">
            <Text id="results.knobs.vertical">Vertical axis</Text>
          </label>
          <select
            id="yselect"
            onchange={handleYSelectChange}
            disabled={shouldDisableYAxisSelect}
          >
            <option value="">
              <Text id="results.knobs.option">choose an option</Text>
            </option>
            {state.questions != null &&
              state.questions.map((option, idx) => (
                <option value={`${idx}`}>{option}</option>
              ))}
          </select>
        </div>
      </div>
      <div class={style.knob}>
        Total = {totalRespondents}{" "}
        <Text id="results.knobs.respondents">respondents</Text>
      </div>

      <div class={style.knob}>
        <button type="button" onclick={handleResetClick}>
          <Text id="results.knobs.reset">Reset</Text>
        </button>
      </div>
      <div class={style.showhide} onClick={handleShowHideClick}>
        <Text id="results.knobs.clickto">Click to </Text>
        {shouldShowKnobs ? (
          <Text id="results.knobs.hide">hide</Text>
        ) : (
          <Text id="results.knobs.show">show</Text>
        )}
      </div>
    </div>
  );
}
