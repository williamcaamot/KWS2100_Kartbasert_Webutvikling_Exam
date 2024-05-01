import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import Switch from "../../ui/switch";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useLayer } from "../map/useLayer";
import { Draw, Modify, Snap } from "ol/interaction";
import { GeoJSON } from "ol/format";
import { drawingStyle } from "./drawingStyle";
import { Feature } from "./Feature";

//BUG Circles doesn't save to localstorage
export type DrawingType = "Circle" | "Polygon" | "Point" | "MultiLineString";
export default function Drawing() {
  const drawingTypes = [
    { type: "Circle" as DrawingType, name: "Sirkel" },
    { type: "Polygon" as DrawingType, name: "Polygon" },
    {
      type: "Point" as DrawingType,
      name: "Punkt",
    },
    { type: "MultiLineString" as DrawingType, name: "Flerlinjestrek" },
  ];

  const [updatedCounter, setUpdatedCounter] = useState(0);
  const [enableDrawingLayer, setEnableDrawingLayer] = useState<boolean>(false);
  const [enableDrawning, setEnableDrawning] = useState<boolean>(false);
  const [drawingType, setDrawingType] = useState<DrawingType>("Circle");
  const [drawSource, setDrawSource] = useState(new VectorSource());
  const [drawLayer, setDrawLayer] = useState(
    new VectorLayer({
      source: drawSource,
      style: drawingStyle,
    }),
  );

  useLayer(drawLayer, enableDrawingLayer);
  const { map } = useContext(MapContext);

  // Make the code below into a custom hook if possible and enough time!
  const modify = new Modify({ source: drawSource });
  const draw = new Draw({
    source: drawSource,
    type: drawingType,
    style: drawingStyle,
  });
  const snap = new Snap({ source: drawSource });

  draw.on("drawend", function (event) {
    event.feature.setProperties({
      text: "Ny feature",
      textColor: "#000000",
      strokeColor: "#1e837a",
    });
  });

  function handlePointerMove() {
    setUpdatedCounter((updatedCounter) => updatedCounter + 1);
  }

  useEffect(() => {
    if (enableDrawning) {
      map.addInteraction(modify);
      map.addInteraction(draw);
      map.addInteraction(snap);
      map?.on("pointermove", handlePointerMove);
    } else {
      map.removeInteraction(modify);
      map.removeInteraction(draw);
      map.removeInteraction(snap);
      map?.un("pointermove", handlePointerMove);
    }
    return () => {
      map.removeInteraction(modify);
      map.removeInteraction(draw);
      map.removeInteraction(snap);
      map?.un("pointermove", handlePointerMove);
    };
  }, [enableDrawning, drawingType]);
  // UNtil here should be custom hook

  useEffect(() => {
    // Load exisiting features from localstorage
    try {
      const features = window.localStorage.getItem("drawing-features");
      if (features) {
        const featuresObj = JSON.parse(features);
        const geojson = new GeoJSON();
        const featuresGeoJSON = geojson.readFeatures(featuresObj);
        featuresGeoJSON.forEach((feature) => {
          drawLayer.getSource()?.addFeature(feature);
        });
      }
    } catch (e) {}
  }, []);

  function handleSaveToLocalStorage() {
    try {
      const features = drawSource.getFeatures();
      const geojsonFormat = new GeoJSON();
      if (features && features.length > 0) {
        const featuresJSON = geojsonFormat.writeFeatures(features);
        window.localStorage.setItem("drawing-features", featuresJSON);
        features.forEach((feature) => {
          //console.log(feature.getProperties());
        });
        setUpdatedCounter(0);
        alert("Endringene ble lagret!");
      } else {
        window.localStorage.removeItem("drawing-features");
        alert("Fjernet alle elementer fra localstorage!");
      }
    } catch (e) {
      console.error("Failed to save features to localStorage", e);
    }
  }

  function handleDeleteFeature(ol_uid: number) {
    const featureToRemove = drawSource
      .getFeatures()
      .find(
        (
          feature: any /*Tried to fix type on this, but turned out to be too time consumung...*/,
        ) => feature.ol_uid === ol_uid,
      );
    if (featureToRemove) {
      drawSource.removeFeature(featureToRemove);
      setUpdatedCounter((updatedCounter) => updatedCounter + 1);
    } else {
      console.log("No feature found with the specified property value");
    }
  }

  return (
    <>
      <div className={"flex w-full justify-around p-1"}>
        <p>Vis tegningslag</p>
        <div className={"flex-1"}></div>
        <Switch checked={enableDrawingLayer} onChange={setEnableDrawingLayer} />
      </div>
      <div className={"flex w-full justify-around p-1"}>
        <p>Tegning</p>
        <div className={"flex-1"}></div>
        <Switch checked={enableDrawning} onChange={setEnableDrawning} />
      </div>

      {/*Radio select drawSource https://flowbite.com/docs/forms/radio/*/}
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
        Figur type
      </h3>
      <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {drawingTypes.map((type) => {
          return (
            <>
              <li
                className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                key={type.name}
              >
                <div
                  className="flex items-center ps-3"
                  onClick={() => setDrawingType(type.type)}
                >
                  <input
                    onChange={() => setDrawingType(type.type)}
                    id={type.type}
                    type="radio"
                    checked={type.type === drawingType && true}
                    value={type.type}
                    name="list-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={type.type}
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

      <div className={"w-full"}>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Features som er tegnet inn:
        </h3>
        {drawSource.getFeatures().map((feature) => {
          return (
            <Feature
              key={feature.getProperties().ol_uid}
              feature={feature}
              handleDeleteFeature={handleDeleteFeature}
            />
          );
        })}
      </div>
    </>
  );
}
