import { ICell, IXMLParsedData } from "@/types/globals";
import { XMLBuilder } from "fast-xml-parser";

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

export const handleXmlSave = async (data: ICell[][], fileName: string) => {
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

  data.forEach((el, i) => {
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
