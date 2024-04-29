import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export type TrainFeature = {
  getProperties(): TrainProperties;
} & Feature<Point>;

export interface TrainProperties {
  line: {
    lineRef: string;
  };
  lastUpdated: string;
  vehicleId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  vehicleStatus: string;
  delay: number;
  speed: number;
  bearing: number;
}

export const trainStyle = (feature: FeatureLike) => {
  const train = feature.getProperties() as TrainProperties;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "black", width: 2 }),
      fill: new Fill({ color: "orange" }),
      radius: 6, // adjust this as needed
    }),
  });
};

export const activeTrainStyle = (feature: FeatureLike) => {
  const train = feature.getProperties() as TrainProperties;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "red", width: 3 }),
      fill: new Fill({ color: "black" }),
      radius: 7, // adjust this as needed
    }),
    text: new Text({
      text: train ? train.line.lineRef : "Unknown",
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
