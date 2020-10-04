import fs from "fs";
import path from "path";

function calcDiff(data1, data2) {
  const result = [];
  const merged = { ...data1, ...data2 };

  for (let key of Object.keys(merged)) {
    const value1 = data1[key];
    const value2 = data2[key];

    if (value1 !== undefined && value2 !== undefined) {
      if (value1 === value2) {
        result.push({ key, value: value1, status: "unmodified" });
      } else {
        result.push({ key, value: value1, status: "deleted" });
        result.push({ key, value: value2, status: "added" });
      }
    } else {
      if (value2 === undefined) {
        result.push({ key, value: value1, status: "deleted" });
      } else {
        result.push({ key, value: value2, status: "added" });
      }
    }
  }

  return result;
}

function formatDiff(diff) {
  const statusToSymbol = {
    unmodified: " ",
    added: "+",
    deleted: "-",
  };

  const lines = diff
    .map(
      (line) => `  ${statusToSymbol[line.status]} ${line.key}: ${line.value}`
    )
    .join("\n");

  return `{\n${lines}\n}`;
}

export default function genDiff(filepath1, filepath2) {
  const file1 = fs.readFileSync(path.resolve(process.cwd(), filepath1), "utf8");
  const file2 = fs.readFileSync(path.resolve(process.cwd(), filepath2), "utf8");

  const data1 = JSON.parse(file1);
  const data2 = JSON.parse(file2);

  const diff = calcDiff(data1, data2);

  return formatDiff(diff);
}
