import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import Switch from "../../ui/switch";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useLayer } from "../map/useLayer";
import { Draw, Modify, Snap } from "ol/interaction";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

//BUG Circles doesn't save to localstorage

export default function Drawing() {
  type DrawingType = "Circle" | "Polygon" | "Point" | "MultiLineString";
  const drawingTypes = [
    { type: "Circle" as DrawingType, name: "Sirkel" },
    { type: "Polygon" as DrawingType, name: "Polygon" },
    {
      type: "Point" as DrawingType,
      name: "Punkt",
    },
    { type: "MultiLineString" as DrawingType, name: "Flerlinjestrek" },
  ];

  const [enableDrawingLayer, setEnableDrawingLayer] = useState<boolean>(false);
  const [enableDrawning, setEnableDrawning] = useState<boolean>(false);
  const [drawingType, setDrawingType] = useState<DrawingType>("Circle");

  const { map } = useContext(MapContext);

  const [source, setSource] = useState(new VectorSource());

  const [vector, setVector] = useState(
    new VectorLayer({
      source: source,
      style: {
        "fill-color": "rgba(255, 255, 255, 0.5)",
        "stroke-color": "#ffcc33",
        "stroke-width": 2,
        "circle-radius": 7,
        "circle-fill-color": "#ffcc33",
      },
    }),
  );

  useLayer(vector, enableDrawingLayer);

  const modify = new Modify({ source: source });
  const draw = new Draw({ source: source, type: drawingType });
  const snap = new Snap({ source: source });

  useEffect(() => {
    if (enableDrawning) {
      map.addInteraction(modify);
      map.addInteraction(draw);
      map.addInteraction(snap);
    } else {
      map.removeInteraction(modify);
      map.removeInteraction(draw);
      map.removeInteraction(snap);
    }

    return () => {
      map.removeInteraction(modify);
      map.removeInteraction(draw);
      map.removeInteraction(snap);
    };
  }, [enableDrawning, drawingType]);

  useEffect(() => {
    try {
      const features = window.localStorage.getItem("drawing-features");
      if (features) {
        const featuresObj = JSON.parse(features);
        const geojson = new GeoJSON();
        const featuresGeoJSON = geojson.readFeatures(featuresObj);
        featuresGeoJSON.forEach((feature) => {
          vector.getSource()?.addFeature(feature);
        });
      }
    } catch (e) {}
  }, []);

  function handleSaveToLocalStorage() {
    try {
      const features = vector.getSource()?.getFeatures();
      const geojsonFormat = new GeoJSON();
      if (features && features.length > 0) {
        const featuresJSON = geojsonFormat.writeFeatures(features);
        window.localStorage.setItem("drawing-features", featuresJSON);
      }
    } catch (e) {
      console.error("Failed to save features to localStorage", e);
    }
  }

  return (
    <>
      <div className={"flex w-full justify-around p-1"}>
        <p>Vis tegningslag</p>
        <div className={"flex-1"}></div>
        <Switch
          checked={enableDrawingLayer}
          onChange={setEnableDrawingLayer}
        ></Switch>
      </div>
      <div className={"flex w-full justify-around p-1"}>
        <p>Tegning</p>
        <div className={"flex-1"}></div>
        <Switch checked={enableDrawning} onChange={setEnableDrawning}></Switch>
      </div>

      {/*Radio select source https://flowbite.com/docs/forms/radio/*/}
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
        Shape type
      </h3>
      <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {drawingTypes.map((type) => {
          return (
            <>
              <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                <div className="flex items-center ps-3">
                  <input
                    onChange={() => setDrawingType(type.type)}
                    id="list-radio-license"
                    type="radio"
                    value=""
                    name="list-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="list-radio-license"
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {type.name}
                  </label>
                </div>
              </li>
            </>
          );
        })}
      </ul>
      <div className={"py-2 w-full"}>
        <button
          className={"w-full p-2 bg-teal-600 text-white rounded"}
          onClick={handleSaveToLocalStorage}
        >
          Lagre
        </button>
      </div>
    </>
  );
}
