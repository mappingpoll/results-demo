import { parseLocalCSV } from "./fetch/parseLocalCSV";
import { applyJitter, cleanQuestions } from "./lib/data-manipulation";
import { calcHeatmap } from "./lib/viztools";

const data = new (function () {
  this.done = false;

  this.standardValues = {
    columnPairs: null,
    rawData: null,
    jitteryData: null,
    heatmaps: null,
    densities: null,
    numbers: null,
  };

  try {
    this.makeRawData();
    this.makeJitteryData();
    this.makeColumnPairs();
    this.makeHeatmaps();
    this.makeNumbers();
    this.done = true;
  } catch (err) {
    console.error(err.message);
  }

  this.makeRawData = async () => {
    const data = await parseLocalCSV("./assets/data/all_maps.csv");
    this.standardValues.rawData = data;
  };

  this.makeJitteryData = () => {
    this.standardValues.jitteryData = applyJitter(this.standardValues.rawData);
  };

  this.makeColumnPairs = () => {
    this.standardValues.columnPairs = cleanQuestions(
      this.standardValues.rawData
    );
  };

  this.makeHeatmaps = () => {
    this.standardValues.heatmaps = this.standardValues.columnPairs.map(pair =>
      calcHeatmap(this.standardValues.rawData, pair)
    );
  };

  this.makeDensities = () => {};
})();

export default data;
