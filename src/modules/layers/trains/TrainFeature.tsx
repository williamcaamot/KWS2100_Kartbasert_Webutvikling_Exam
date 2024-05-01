import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";

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
    return [
      new Style({
        image: new Circle({
          radius: 14, // adjust this as needed
          fill: new Fill({ color: 'grey' }), // this is the background color
        }),
      }),
      new Style({
        image: new Icon({
          src: "/kws2100-exam-williamcaamot/img/vecteezy_transport-train-icon-sign-design_10155649.png",
          scale: 0.004,
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
        }),
      }),
    ];
  };

export const activeTrainStyle = (feature: FeatureLike) => {
  const train = feature.getProperties() as TrainProperties;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "grey", width: 3 }),
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
