import { ICell } from "@/types/globals";

export const splitDataToLines = (data: string, delimeter: string = "\n") => {
  return data.split(delimeter);
};
export const splitLine = (line: string, delimeter: string = ";") => {
  return line.split(delimeter);
};

export function downloadTxt(filename: string, text: string) {
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
