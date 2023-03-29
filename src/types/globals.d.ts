export type ICellDataType =
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

export interface ICell {
  type: ICellDataType;
  value: string;
  error: string | null;
}

export interface IXMLParsedData {
  laptops: {
    "@_moddate": string;
    laptop: {
      manufacturer: string;
      screen: {
        size: string;
        resolution: string;
        type: string;
        "@_touch": "no" | "yes";
      };
      processor: {
        name: string;
        physical_cores: number | "";
        clock_speed: number | "";
      };
      ram: string;
      disc: {
        storage: string;
        "@_type": string;
      };
      graphic_card: {
        name: string;
        memory: string;
      };
      os: string;
      disc_reader: string;
      "@_id": string;
    }[];
  };
}
