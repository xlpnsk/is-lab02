import * as React from "react";
import { Cell } from "./Cell";
import styles from "@/styles/Home.module.css";
import { ICell } from "@/types/globals";

const compareArrays = (a: ICell[], b: ICell[]) =>
  a.length === b.length &&
  a.every((element, index) => element.value === b[index].value);

interface IRow {
  isDuplicate: boolean;
  values: ICell[];
  onInputChange: (
    col: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Row: React.FC<IRow> = ({ isDuplicate, values, onInputChange }) => {
  // remember initial props between rerenders
  const [ref, setRef] = React.useState<ICell[]>([]);

  React.useEffect(() => {
    console.log("ref");
    setRef([...values]);
  }, []);
  console.log(values[0], ref[0]);

  const [hasChanged, setHasChanged] = React.useState<boolean>(false);

  React.useEffect(() => {
    console.log("chn");
    ref.length > 0 && setHasChanged(!compareArrays(values, ref));
  }, [JSON.stringify(values)]);

  return (
    <tr
      className={
        isDuplicate
          ? styles.duplicate
          : hasChanged
          ? styles.changed
          : styles.base
      }
    >
      {values.map((value, index) => (
        <Cell cellData={value} setValue={onInputChange(index)} key={index} />
      ))}
    </tr>
  );
};
