import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";

export type JernbanelinjerFeature = {
  getProperties(): jernbanelinjerProperties;
} & Feature<Point>;

export interface jernbanelinjerProperties {
  sporantall: string;
  medium: string;
}

export const jernbaneLinjerStyle = (feature: FeatureLike) => {
  const jernbaneLinje = feature.getProperties() as jernbanelinjerProperties;
  return new Style({
    stroke: new Stroke({
      color: jernbaneLinje.sporantall === "E" ? "#0F172A" : "#0D9488",
      width: 3,
    }),
  });
};

export const activeJernbanelinjerStyle = (feature: FeatureLike) => {
  const jernbaneLinje = feature.getProperties() as jernbanelinjerProperties;
  return new Style({
    stroke: new Stroke({
      color: jernbaneLinje.sporantall === "E" ? "#94A3B8" : "#0D9488",
      width: 3,
    }),
    text: new Text({
      text: jernbaneLinje.sporantall + " " + jernbaneLinje.medium,
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
