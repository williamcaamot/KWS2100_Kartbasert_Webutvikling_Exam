import Feature, { FeatureLike } from "ol/Feature";
import { Point } from "ol/geom";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

interface Translation {
  language: string;
  value: string;
}

interface Description {
  translation: Translation[];
}

interface PricingPlan {
  description: Description;
}

interface Name {
  translation: Translation[];
}

interface System {
  name: Name;
}

export interface MobilityVehicle {
  setStyle(activeTrainStyle: any): unknown;
  id: string;
  lat: number;
  lon: number;
  pricingPlan: PricingPlan;
  system: System;
  isReserved: boolean;
  isDisabled: boolean;
  currentRangeMeters: number;
}

export interface MobilityVehiclesResponse {
  vehicles: MobilityVehicle[];
}

export type MobilityVehiclesFeature = {
  getProperties(): MobilityVehicle;
} & Feature<Point>;

export const mobilityStyle = (feature: FeatureLike) => {
  const mobilityVehicle = feature.getProperties() as MobilityVehicle;
  return new Style({
    image: new Circle({
      stroke: new Stroke(
        !mobilityVehicle.isReserved
          ? { color: "lightGreen", width: 4 }
          : { color: "red", width: 4 },
      ),
      fill: new Fill(
        mobilityVehicle.system.name.translation[0].value === "Voi Technology AB"
          ? { color: "blue" }
          : { color: "purple" },
      ),
      radius: 8, // adjust this as needed
    }),
  });
};

export const mobilityActiveStyle = (feature: FeatureLike) => {
  const mobilityVehicle = feature.getProperties() as MobilityVehicle;
  return new Style({
    image: new Circle({
      stroke: new Stroke(
        mobilityVehicle.system.name.translation[0].value === "Voi Technology AB"
          ? { color: "blue" }
          : { color: "purple" },
      ),
      fill: new Fill(
        mobilityVehicle.system.name.translation[0].value === "Voi Technology AB"
          ? { color: "blue" }
          : { color: "purple" },
      ),
      radius: 7, // adjust this as needed
    }),
    text: new Text({
      text: mobilityVehicle
        ? mobilityVehicle.system.name.translation[0].value
        : "Unknown", // Access the name property and convert it to a string
      font: "bold 14px sans-serif",
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "black" }),
      offsetY: -10,
    }),
  });
};
