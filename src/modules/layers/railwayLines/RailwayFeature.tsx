import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";

export type RailwayFeature = {
  getProperties(): railwayProperties;
} & Feature<Point>;

export interface railwayProperties {
  sporantall: string;
  medium: string;
}

export const railwayStyle = (feature: FeatureLike) => {
  const railway = feature.getProperties() as railwayProperties;
  return new Style({
    stroke: new Stroke({
      color: railway.sporantall === "E" ? "#0F172A" : "#0D9488",
      width: 3,
    }),
  });
};

export const activeRailwayStyle = (feature: FeatureLike) => {
  const railway = feature.getProperties() as railwayProperties;
  return new Style({
    stroke: new Stroke({
      color: railway.sporantall === "E" ? "#94A3B8" : "#0D9488",
      width: 3,
    }),
    text: new Text({
      text: railway.sporantall === "F" ? "Flerspor" : "Enkeltspor",
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
