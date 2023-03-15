import Head from "next/head";
import Image from "next/image";
import { Roboto } from "next/font/google";
import styles from "@/styles/Home.module.css";
import * as React from "react";
import { spawn } from "child_process";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const splitDataToLines = (data: string, delimeter: string = "\n") => {
  return data.split(delimeter);
};
const splitLine = (line: string, delimeter: string = ";") => {
  return line.split(delimeter);
};

function download(filename: string, text: string) {
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

const headers: ICellDataType[] = [
  "Producent",
  "Diagonal",
  "Resolution",
  "Surface",
  "Touchable",
  "CPU",
  "Cores",
  "MHz",
  "RAM",
  "Diskspace",
  "Disktype",
  "GPU",
  "GPU Memory",
  "OS",
  "Drive",
];

type ICellDataType =
  | "Producent"
  | "Diagonal"
  | "Resolution"
  | "Surface"
  | "Touchable"
  | "CPU"
  | "Cores"
  | "MHz"
  | "RAM"
  | "Diskspace"
  | "Disktype"
  | "GPU"
  | "GPU Memory"
  | "OS"
  | "Drive";

interface ICell {
  type: ICellDataType;
  value: string;
  error: string | null;
}

function joinDataTable(dataTable: ICell[][]): string {
  return dataTable
    .map((line) => `${line.map((cell) => cell.value).join(";")};`)
    .join("\n");
}

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

function validateCell(cell: ICell) {
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
      checkIfIn(cell.value, ["błyszcząca", "matowa"]);
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

export default function Home() {
  const [file, setFile] = React.useState<File>();
  const [tableArray, setTableArray] = React.useState<ICell[][]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const inputFile = e.target.files[0];
      console.log(e.target.files[0].type);
      if (inputFile.type !== "text/plain") {
        setError("Invalid file type");
      } else {
        setError(null);
        setFile(inputFile);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const row = parseInt(e.target.getAttribute("data-row") || "");
    const col = parseInt(e.target.getAttribute("data-col") || "");
    let tableArrayCopy = [...tableArray];
    let error = null;

    try {
      validateCell({
        value: e.target.value,
        type: tableArray[row][col].type,
        error: null,
      });
    } catch (err: any) {
      error = err.message as string;
    }
    console.log(error);

    tableArrayCopy[row][col] = {
      ...tableArray[row][col],
      value: e.target.value,
      error: error,
    };
    setTableArray(tableArrayCopy);
  };

  React.useEffect(() => {
    file
      ?.text()
      .then((txt) => {
        const mappedData = splitDataToLines(txt, "\n").map((line) =>
          splitLine(line.slice(0, line.length - 1), ";").map((element, idx) => {
            const cell: ICell = {
              type: headers[idx],
              value: element,
              error: null,
            };
            return cell;
          })
        );
        setTableArray(mappedData);
      })
      .catch((err) => console.error(err));
  }, [file]);
  const anyErrors = tableArray.reduce(
    (prev, curr) =>
      prev || curr.reduce((pr, cr) => pr || cr.error !== null, false),
    false
  );

  return (
    <>
      <Head>
        <title>Lab02</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${roboto.className}`}>
        <div>
          <div>
            <input type="file" onChange={handleFileChange} />
            {file && !anyErrors && (
              <button
                onClick={() =>
                  download(
                    `${file?.name.replace(".txt", "")}-export.txt`,
                    joinDataTable(tableArray)
                  )
                }
              >
                Export
              </button>
            )}
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
        {file && (
          <div className={styles.tabcont}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {headers.map((head) => (
                    <th key={head}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableArray.map((line, row) => {
                  return (
                    <tr key={row}>
                      {line.map((cell, col) => (
                        <td
                          key={`${row}-${col}`}
                          style={{
                            backgroundColor: cell.error ? "red" : "transparent",
                          }}
                        >
                          <input
                            type="text"
                            data-row={row}
                            data-col={col}
                            value={cell.value}
                            onChange={handleInputChange}
                          />
                          {cell.error && (
                            <span className={styles.tooltipwrap}>
                              <span className={styles.tooltip}>
                                {cell.error}
                              </span>
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
