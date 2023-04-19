import { ICell } from "@/types/globals";
import { headers } from "./headers";

export const splitDataToLines = (data: string, delimeter: string = "\n") => {
  return data.split(delimeter);
};
export const splitLine = (line: string, delimeter: string = ";") => {
  return line.split(delimeter);
};

export function downloadTxt(text: string, filename: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function joinDataTable(dataTable: ICell[][]): string {
  return dataTable
    .map((line) => `${line.map((cell) => cell.value).join(";")};`)
    .join("\n");
}

export function mapTxt(txt: string) {
  return splitDataToLines(txt, "\n").map((line) =>
    splitLine(line.slice(0, line.length - 1), ";").map((element, idx) => {
      const cell: ICell = {
        type: headers[idx],
        value: element,
        error: null,
      };
      return cell;
    })
  );
}
