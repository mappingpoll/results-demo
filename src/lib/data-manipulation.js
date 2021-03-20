import { cloneDeep } from "lodash";
import { UNCERTAINTY } from "../constants";
import jitter from "../fetch/jitter";
import { isValidDatum } from "./viztools";

export function cleanQuestions(data, header) {
  return Object.keys(data[0]).filter(
    q => q != "poll" && q != "Language" && q != "id"
  );
}

export function getPairwiseColumns(questions) {
  let pairs = [];
  // iterate pairwise
  for (let idx = 0; idx < questions.length; idx += 2) {
    const columns = [questions[idx], questions[idx + 1]];
    pairs.push(columns);
  }
  return pairs;
}

export function getCustomColumns(questions, axes) {
  return Object.values(axes)
    .filter(a => a !== "")
    .map(a => questions[a]);
}

export function filterDataByDataset(data, dataset) {
  return data.filter(d => {
    for (let condition in dataset) {
      if (d.Language === condition && !dataset[condition]) return false;
      if (d.poll.toLowerCase() === condition && !dataset[condition])
        return false;
    }
    return true;
  });
}

export function filterDataByRange(data, column, range) {
  return data.filter(
    d =>
      isValidDatum(d, column) && range[0] <= d[column] && d[column] <= range[1]
  );
}

export function inRange(n, range) {
  if (isNaN(n)) return false;
  return range[0] <= n && n <= range[1];
}

export function inStandardColumnSet(columnSet, columns) {
  return (
    columnSet.find(pair => pair[0] === columns[0] && pair[1] === columns[1]) !=
    null
  );
}

export function applyJitter(data) {
  const dataCopy = cloneDeep(data);
  for (const row of dataCopy) {
    for (const key in row) {
      if (typeof row[key] === "number") row[key] += jitter(UNCERTAINTY);
    }
  }
  return dataCopy;
}

export function countGraphRegions(data, columns) {
  const [a, b] = columns;
  const region = {
    origin: 0,
    quadrants: { nw: 0, ne: 0, se: 0, sw: 0 },
    outerQuadrants: { nw: 0, ne: 0, se: 0, sw: 0 },
    axes: { n: 0, e: 0, s: 0, w: 0 },
    outerAxes: { n: 0, e: 0, s: 0, w: 0 },
  };
  data.forEach(respondent => {
    let x = respondent[a],
      y = respondent[b];
    if (typeof x === "number" && typeof y === "number") {
      // origin
      if (x === 0 && y === 0) {
        region.origin++;
        // quadrants
      } else if ([x, y].every(n => n >= -10 && n <= 10 && n !== 0)) {
        if (x < 0 && y < 0) {
          region.quadrants.sw++;
        } else if (x > 0 && y < 0) {
          region.quadrants.se++;
        } else if (x > 0 && y > 0) {
          region.quadrants.ne++;
        } else if (x < 0 && y > 0) {
          region.quadrants.nw++;
        }
        // axes
      } else if (x === 0) {
        if (y < -10) {
          region.outerAxes.s++;
        } else if (y > 10) {
          region.outerAxes.n++;
        } else if (y < 0) {
          region.axes.s++;
        } else if (y > 0) {
          region.axes.n++;
        }
      } else if (y === 0) {
        if (x < -10) {
          region.outerAxes.w++;
        } else if (x > 10) {
          region.outerAxes.e++;
        } else if (x < 0) {
          region.axes.w++;
        } else if (x > 0) {
          region.axes.e++;
        }
        //outer quadrants
      } else if ([x, y].every(n => n < -10 || n > 10)) {
        if (x < -10 && y < -10) {
          region.outerQuadrants.sw++;
        } else if (x > 10 && y < -10) {
          region.outerQuadrants.se++;
        } else if (x > 10 && y > 10) {
          region.outerQuadrants.ne++;
        } else if (x < -10 && y > 10) {
          region.outerQuadrants.nw++;
        }
      }
    }
  });
  return region;
}

export function countStandardSetGraphRegions(data, header) {
  const counts = {};
  // pairwise iteration
  for (let i = 0; i < header.length; i += 2) {
    const a = header[i],
      b = header[i + 1];

    // save region counts under both colnames for easy reference later
    counts[a] = counts[b] = countGraphRegions(data, [a, b]);
  }
  return counts;
}
