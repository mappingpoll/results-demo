import { interpolateRgbBasis } from "d3";

export const NA_SYMBOL = "NA";

export const GRAPH_TYPE = {
  scatterplot: "scatterplot",
  heatmap: "heatmap",
  density: "density scatterplot",
  contour: "contour",
  colorContour: "color contour",
  contourScatterplot: "contour scatterplot",
  numbers: "numbers",
};
export const COLOR_SCHEME = {
  greyscale: "interpolateGreys",
  viridis: "interpolateViridis",
  plasma: "interpolatePlasma",
  warm: "interpolateWarm",
  cividis: "interpolateCividis",
  coolwarm: "coolwarm",
  nicolas: "nicolas",
  nicolas2: "nicolas2",
  nicolas3: "nicolas3",
};

export const CUSTOM_COLORS = {
  coolwarm: interpolateRgbBasis(["CornflowerBlue", "DimGray", "IndianRed"]),
  nicolas: interpolateRgbBasis([
    "#de0000",
    "#b9001e",
    "#a5013c",
    "#920e64",
    "#782793",
    "#694dc6",
    "#4e6ee3",
    "#1e83ff",
    "#03a2ff",
  ]),
  nicolas2: interpolateRgbBasis([
    "#efddff",
    "#e6abe6",
    "#d65da4",
    "#d65da4",
    "#640700",
  ]),
  nicolas3: interpolateRgbBasis(["#eeeeee", "#272727"]),
};
export const DEFAULT_DOT_COLOR = "black";
export const DEFAULT_COLOR_SCHEME = COLOR_SCHEME.nicolas3;
export const DEFAULT_GRAPH_TYPE = GRAPH_TYPE.scatterplot;
export const DEFAULT_DOT_SIZE = 18;
export const DEFAULT_DOT_OPACITY = 0.13;
export const HIGHLIGHT_OPACITY = 1;
export const HIGHLIGHT_COLOR = "red";
export const DEFAULT_COLOR_MID = 1;
export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 1000;
export const DEFAULT_CANVAS_MARGIN = {
  top: 30,
  bottom: 30,
  right: 100,
  left: 100,
};

// should be same as --track-width, --track-height, etc in src/style/index.css
export const TRACK_WIDTH = 400;
export const TRACK_HEIGHT = 5;
export const THUMB_HEIGHT = 20;
export const THUMB_WIDTH = 20;

export const DATASETS = {
  language: ["en", "fr"],
  form: ["aga", "ba"],
};
export const MARGIN = DEFAULT_CANVAS_MARGIN;
export const UNCERTAINTY = 0.5;
export const DOMAIN = [-15, 15];
export const AXES_DOMAIN = [-10, 10];
function rangeDiscreet(range) {
  const min = Math.min(...range),
    max = Math.max(...range);
  return new Array(max - min + 1).fill(0).map((_, i) => i + min);
}
export const DOMAIN_DISCREET = rangeDiscreet(DOMAIN);
export const AXES_DOMAIN_DISCREET = rangeDiscreet(AXES_DOMAIN);
export const ORIGIN = {
  x: MARGIN.left + DEFAULT_CANVAS_WIDTH / 2,
  y: MARGIN.top + DEFAULT_CANVAS_HEIGHT / 2,
};
export const VIEWBOX = [
  0,
  0,
  MARGIN.left + DEFAULT_CANVAS_WIDTH + MARGIN.right,
  MARGIN.top + DEFAULT_CANVAS_HEIGHT + MARGIN.bottom,
];

export const INITIAL_STATE = {
  data: null,
  filteredDataset: null,
  standardRegionCounts: null,
  questions: null,
  vizColumns: [],
  standardColumnSet: [],
  customViz: false,
  userAxes: {
    x: "",
    y: "",
  },
  brushMap: {},
  colorScale: () => {}, //getColorScale(DEFAULT_COLOR_SCHEME, AXES_DOMAIN),
  options: {
    reverseColor: false,
    size: DEFAULT_DOT_SIZE,
    opacity: DEFAULT_DOT_OPACITY,
    contourBandwidth: 25,
    graph: DEFAULT_GRAPH_TYPE,
    color: DEFAULT_COLOR_SCHEME,
    k: DEFAULT_COLOR_MID,
    dataset: {
      aga: true,
      ba: true,
      en: true,
      fr: true,
    },
  },
};
