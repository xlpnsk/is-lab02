import Head from "next/head";
import { Roboto } from "next/font/google";
import styles from "@/styles/Home.module.css";
import * as React from "react";
import {
  downloadTxt,
  joinDataTable,
  splitDataToLines,
  splitLine,
} from "@/utlis/txt";
import { ICell, IXMLParsedData } from "@/types/globals";
import { validateCell, validateTxtFileFormat } from "@/utlis/validator";
import { headers } from "@/utlis/headers";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { parseXmlToCellData } from "@/utlis/xml";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function Home() {
  const [file, setFile] = React.useState<File>();
  const [tableArray, setTableArray] = React.useState<ICell[][]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const inputFile = e.target.files[0];
    if (inputFile.type === "text/plain") {
      inputFile
        .text()
        .then((txt) => validateTxtFileFormat(txt))
        .then(() => {
          setError(null);
          setFile(inputFile);
        })
        .catch((err) => setError(err.message));
    } else if (
      inputFile.type.includes("application/xml") ||
      inputFile.type.includes("text/xml")
    ) {
      inputFile
        .text()
        .then(() => {
          setError(null);
          setFile(inputFile);
        })
        .catch((err) => setError(err.message));
    } else {
      setError("Invalid file type");
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

    tableArrayCopy[row][col] = {
      ...tableArray[row][col],
      value: e.target.value,
      error: error,
    };
    setTableArray(tableArrayCopy);
  };

  const parseTxt = () => {
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
  };

  const handleXmlRead = async () => {
    const parser = new XMLParser({ ignoreAttributes: false });
    const fileContent = await file?.text();
    if (!fileContent) {
      setError("Bad data format");
      return;
    }
    const data = parser.parse(fileContent) as IXMLParsedData;
    setTableArray(parseXmlToCellData(data.laptops.laptop));
  };

  const handleXmlSave = async (fileName: string) => {
    const options = {
      ignoreAttributes: false,
    };

    const currDate = new Date();

    const dateString = `${currDate.getFullYear()}-${(currDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currDate
      .getDate()
      .toString()
      .padStart(2, "0")} T ${currDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currDate.getMinutes().toString().padStart(2, "0")}`;

    let string = `<laptops moddate="${dateString}">`;

    const builder = new XMLBuilder(options);

    tableArray.forEach((el, i) => {
      const obj = {
        laptop: {
          "@_id": i + 1,
          manufacturer: el[0].value,
          screen: {
            "@_touch": el[4].value === "tak" ? "yes" : "no",
            size: el[1].value,
            resolution: el[2].value,
            type: el[3].value,
          },
          processor: {
            name: el[5].value,
            physical_cores: el[6].value,
            clock_speed: el[7].value,
          },
          ram: el[8].value,
          disc: {
            "@_type": el[10].value,
            storage: el[9].value,
          },
          graphic_card: {
            name: el[11].value,
            memory: el[12].value,
          },
          os: el[13].value,
          disc_reader: el[14].value,
        },
      };

      const xmlDataStr = builder.build(obj);
      string += xmlDataStr;
    });

    string += "</laptops>";

    const anchor = document.createElement("a");
    const blob = new Blob([string], { type: "text/plain" });

    anchor.setAttribute("href", window.URL.createObjectURL(blob));
    anchor.setAttribute("download", fileName);

    anchor.dataset.downloadurl = [
      "text/plain",
      anchor.download,
      anchor.href,
    ].join(":");

    anchor.click();
  };

  React.useEffect(() => {
    if (!file) return;
    if (file?.type.includes("text/plain")) {
      parseTxt();
    } else if (
      file?.type.includes("application/xml") ||
      file?.type.includes("text/xml")
    ) {
      handleXmlRead();
    } else {
      setError("Invalid file format");
    }
  }, [file]);

  const anyErrors = tableArray.reduce(
    (prev, curr) =>
      prev || curr.reduce((pr, cr) => pr || cr.error !== null, false),
    false
  );

  return (
    <>
      <Head>
        <title>Lab03</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${roboto.className}`}>
        <div>
          <div>
            <input type="file" onChange={handleFileChange} />
            {file && !anyErrors && (
              <div className={styles.buttons}>
                <button
                  onClick={() =>
                    downloadTxt(`export.txt`, joinDataTable(tableArray))
                  }
                >
                  Export to TXT
                </button>
                <button onClick={() => handleXmlSave(`export.xml`)}>
                  Export to XML
                </button>
              </div>
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
