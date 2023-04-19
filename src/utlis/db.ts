import { ICell, IDBData, IDbResp } from "@/types/globals";
import { log } from "console";

export const compareWithDb = (current: ICell[][], db: ICell[][]) =>
  current.length === db.length &&
  current.every(
    (row, rowIdx) =>
      row.length === db[rowIdx].length &&
      row.every((element, colIdx) => element.value === db[rowIdx][colIdx].value)
  );

export function findDuplicates(arr: ICell[][]) {
  //find duplicates in an array of arrays comparing every element in a row
  const dupl: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].every((el, idx) => el.value === arr[j][idx].value)) {
        dupl.push(i);
      }
    }
  }
  return { duplicates: dupl, count: dupl.length };
}

export async function getDbData() {
  const resp = await fetch("/api/db");
  const data = (await resp.json()) as IDbResp;
  return data;
}

export async function saveDbData(data: ICell[][]) {
  const resp = await fetch("/api/db", {
    method: "PUT",
    body: JSON.stringify(parseToDbData(data)),
  });
  console.log(JSON.stringify(parseToDbData(data)));

  const repData = (await resp.json()) as IDbResp;
  return repData;
}

export function parseDbData(dbData: IDBData[]): ICell[][] {
  //@ts-ignore
  return dbData.map(({ _id, ...row }) =>
    Object.entries(row).map(([key, value]) => {
      switch (key) {
        case "producent":
        case "resolution":
        case "surface":
        case "touchable":
        case "cores":
        case "diskspace":
        case "disktype":
        case "drive": {
          return {
            type: key.charAt(0).toUpperCase() + key.slice(1),
            value:
              typeof value === "boolean"
                ? value === true
                  ? "tak"
                  : "nie"
                : typeof value === "string"
                ? value
                : value.toString(),
            error: null,
          } as ICell;
        }
        case "cpu":
        case "ram":
        case "gpu":
        case "os": {
          return {
            type: key.toUpperCase(),
            value:
              typeof value === "boolean"
                ? value === true
                  ? "tak"
                  : "nie"
                : typeof value === "string"
                ? value
                : value.toString(),
            error: null,
          } as ICell;
        }
        case "gpu_memory": {
          return {
            type: "GPU Memory",
            value: value,
            error: null,
          } as ICell;
        }
        case "mhz": {
          return {
            type: "MHz",
            value: value.toString(),
            error: null,
          };
        }
        case "diagonal": {
          return {
            type: "Diagonal",
            value: value.toString() + '"',
            error: null,
          };
        }
      }
    })
  );
}

function parseToDbData(data: ICell[][]): Omit<IDBData, "_id">[] {
  //@ts-ignore
  return data.map((row) => {
    return {
      producent: row[0].value,
      diagonal: parseInt(row[1].value.slice(0, -1)),
      resolution: row[2].value,
      surface: row[3].value,
      touchable: row[4].value === "tak" ? true : false,
      cpu: row[5].value,
      cores: parseInt(row[6].value),
      mhz: parseInt(row[7].value),
      ram: row[8].value,
      diskspace: row[9].value,
      disktype: row[10].value,
      gpu: row[11].value,
      gpu_memory: row[12].value,
      os: row[13].value,
      drive: row[14].value,
    };
  });
}
