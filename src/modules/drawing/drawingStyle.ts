import { FeatureLike } from "ol/Feature";
import CircleStyle from "ol/style/Circle";
import { Fill, Stroke, Style, Text } from "ol/style";

export function drawingStyle(f: FeatureLike) {
  // https://openlayers.org/en/latest/examples/draw-features-style.html how to sytle different styles inspired from here

  if (f.getGeometry()?.getType() === "Point") {
    return new Style({
      image: new CircleStyle({
        radius: 5,
        fill: undefined,
        stroke: new Stroke({ color: f.getProperties().strokeColor, width: 2 }),
      }),
      text: new Text({
        text: f.getProperties().text,
        offsetY: -15,
        font: "bold 14px arial",
        fill: new Fill({ color: f.getProperties().textColor }),
        stroke: new Stroke({ color: "white" }),
      }),
    });
  }

  if (f.getGeometry()?.getType() === "Polygon") {
    return new Style({
      stroke: new Stroke({
        color: f.getProperties().strokeColor,
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(0, 0, 255, 0.1)",
      }),
      text: new Text({
        text: f.getProperties().text,
        offsetY: -15,
        font: "bold 14px arial",
        fill: new Fill({ color: f.getProperties().textColor }),
        stroke: new Stroke({ color: "#fc03c6" }),
      }),
    });
  }

  if (f.getGeometry()?.getType() === "MultiLineString") {
    return new Style({
      stroke: new Stroke({
        color: f.getProperties().strokeColor,
        width: 3,
      }),
      text: new Text({
        text: f.getProperties().text,
        offsetY: -15,
        font: "bold 14px arial",
        fill: new Fill({ color: f.getProperties().textColor }),
        stroke: new Stroke({ color: "white" }),
      }),
    });
  }

  if (f.getGeometry()?.getType() === "MultiPolygon") {
    return new Style({
      stroke: new Stroke({
        color: f.getProperties().strokeColor,
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(255, 255, 0, 0.1)",
      }),
      text: new Text({
        text: f.getProperties().text,
        offsetY: -15,
        font: "bold 14px arial",
        fill: new Fill({ color: f.getProperties().textColor }),
        stroke: new Stroke({ color: "white" }),
      }),
    });
  }

  return new Style({
    stroke: new Stroke({
      color: f.getProperties().strokeColor,
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(255, 0, 0, 0.1)",
    }),
    image: new CircleStyle({
      radius: 5,
      fill: undefined,
      stroke: new Stroke({ color: f.getProperties().strokeColor, width: 2 }),
    }),
    text: new Text({
      text: f.getProperties().text,
      offsetY: -15,
      font: "bold 14px arial",
      fill: new Fill({ color: f.getProperties().textColor }),
      stroke: new Stroke({ color: "white" }),
    }),
  });
}
