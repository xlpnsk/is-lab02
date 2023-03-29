import { ICell } from "@/types/globals";
import { headers } from "./headers";
import { splitDataToLines, splitLine } from "./txt";

function checkEmpty(value: string) {
  if (value.trim().length === 0) {
    throw new Error("String cannot be empty");
  }
}

function checkIfIn(value: string, possibleValues: string[]) {
  if (!possibleValues.includes(value)) {
    throw new Error(`Value not in: ${possibleValues.join(", ")}`);
  }
}

function checkIfNumber(value: string) {
  if (isNaN(parseInt(value))) {
    throw new Error(`Not a number`);
  }
}

export function validateCell(cell: ICell) {
  checkEmpty(cell.value);
  switch (cell.type) {
    case "Producent": {
      break;
    }
    case "Diagonal": {
      if (!/(^\d{2,}"$)/gm.test(cell.value)) {
        throw new Error("Bad format");
      }
      break;
    }
    case "Resolution": {
      if (!/(^\d{3,}x\d{3,}$)/gm.test(cell.value))
        throw new Error("Bad format");
      break;
    }
    case "Surface": {
      checkIfIn(cell.value, ["błyszcząca", "matowa", "błyszczący", "matowy"]);
      break;
    }
    case "Touchable": {
      checkIfIn(cell.value, ["tak", "nie"]);
      break;
    }
    case "CPU": {
      break;
    }
    case "Cores": {
      checkIfNumber(cell.value);
      break;
    }
    case "MHz": {
      checkIfNumber(cell.value);
      break;
    }
    case "RAM": {
      if (!/^\d+(GB|MB|KB)$/gm.test(cell.value)) throw new Error("Bad format");
      break;
    }
    case "Diskspace": {
      if (!/^\d+(GB|MB|KB)$/gm.test(cell.value)) throw new Error("Bad format");
      break;
    }
    case "Disktype": {
      checkIfIn(cell.value, ["SSD", "HDD"]);
      break;
    }
    case "GPU": {
      break;
    }
    case "GPU Memory": {
      if (!/^\d+(GB|MB|KB)$/gm.test(cell.value)) throw new Error("Bad format");
      break;
    }
    case "OS": {
      break;
    }
    case "Drive": {
      break;
    }
  }
}

export function validateTxtFileFormat(text: string) {
  const mappedText = splitDataToLines(text, "\n").map((line) =>
    splitLine(line.slice(0, line.length - 1), ";")
  );
  const correctNumCols = mappedText.reduce(
    (prev, curr) => prev && curr.length === headers.length,
    true
  );
  if (!correctNumCols) throw new Error("Invalid data format");
}
