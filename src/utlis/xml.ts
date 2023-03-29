import { ICell, IXMLParsedData } from "@/types/globals";

export const parseXmlToCellData: (
  laptops: IXMLParsedData["laptops"]["laptop"]
) => ICell[][] = (laptops) => {
  const result: ICell[][] = laptops.map((el) => [
    {
      type: "Producent",
      value: el.manufacturer,
      error: null,
    },
    {
      type: "Diagonal",
      value: el.screen.size,
      error: null,
    },
    {
      type: "Resolution",
      value: el.screen.resolution,
      error: null,
    },
    {
      type: "Surface",
      value: el.screen.type,
      error: null,
    },
    {
      type: "Touchable",
      value: el.screen["@_touch"] === "no" ? "nie" : "tak",
      error: null,
    },
    { type: "CPU", value: el.processor.name, error: null },
    {
      type: "Cores",
      value:
        typeof el.processor.physical_cores === "string"
          ? ""
          : el.processor.physical_cores.toString(),
      error: null,
    },
    {
      type: "MHz",
      value:
        typeof el.processor.clock_speed === "string"
          ? ""
          : el.processor.clock_speed.toString(),
      error: null,
    },
    { type: "RAM", value: el.ram, error: null },
    { type: "Diskspace", value: el.disc.storage, error: null },
    { type: "Disktype", value: el.disc["@_type"], error: null },
    { type: "GPU", value: el.graphic_card.name, error: null },
    { type: "GPU Memory", value: el.graphic_card.memory, error: null },
    { type: "OS", value: el.os, error: null },
    { type: "Drive", value: el.disc_reader, error: null },
  ]);
  return result;
};
