import {
  DOMAIN,
  DOMAIN_DISCREET,
  MARGIN,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from "../constants";
import { scaleLinear, scaleBand } from "d3";

const xScale = scaleLinear()
  .domain(DOMAIN)
  .range([MARGIN.left, MARGIN.left + DEFAULT_CANVAS_WIDTH]);

const yScale = scaleLinear()
  .domain(DOMAIN)
  .range([MARGIN.top + DEFAULT_CANVAS_HEIGHT, MARGIN.top]);

//heatmap
const xBand = scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([MARGIN.left, MARGIN.left + DEFAULT_CANVAS_WIDTH]);
const yBand = scaleBand()
  .domain(DOMAIN_DISCREET)
  .range([MARGIN.top + DEFAULT_CANVAS_HEIGHT, MARGIN.top]);

export { xScale, yScale, xBand, yBand };
