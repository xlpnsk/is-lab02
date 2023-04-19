import * as React from "react";
import styles from "@/styles/Home.module.css";
import { ICell as ICellType } from "@/types/globals";

interface ICell {
  cellData: ICellType;
  setValue: React.ChangeEventHandler<HTMLInputElement>;
}
export const Cell: React.FC<ICell> = ({ cellData, setValue }) => {
  const { value, error } = cellData;
  return (
    <td>
      <input type="text" value={value} onChange={setValue} />
      {error && (
        <span className={styles.tooltipwrap}>
          <span className={styles.tooltip}>{error}</span>
        </span>
      )}
    </td>
  );
};
