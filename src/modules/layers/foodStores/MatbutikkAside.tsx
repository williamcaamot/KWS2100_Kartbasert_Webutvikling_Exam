import React, { useContext, useEffect, useMemo, useState } from "react";
import { useVectorFeatures } from "../../map/useVectorFeatures";
import {
  MatbutikkFeature,
  MatbutikkLayerType,
  MatbutikkProperties,
  hoverMatbutikkStyleFunction,
} from "./MatbutikkLayer";
import { useActiveFeatures } from "../../map/useActiveFeatures";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { MapContext } from "../../map/mapContext";
import { containsCoordinate } from "ol/extent";
import * as ol from "ol";
import { Layer } from "ol/layer";
import { Coordinate } from "ol/coordinate";
import { Polygon } from "ol/geom";
import { getCenter } from "ol/extent";

export function selectedMatbutikkStyle(feature: FeatureLike) {
  const matbutikkFeature = feature.getProperties() as MatbutikkProperties;

  return new Style({
    stroke: new Stroke({
      color: "black",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 255, 0, 0.1)",
    }),
    text: new Text({
      text: matbutikkFeature.name, // Display the kommunenavn
      overflow: true,
      font: "bold 15px sans-serif",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 6 }),
    }),
  });
}

export function useMatbutikklayer() {
  const { map, vectorLayers } = useContext(MapContext);
  const layer = vectorLayers.find(
    (l) => l.getClassName() === "MatbutikkerLayer",
  ) as MatbutikkLayerType;

  const [features, setFeatures] = useState<MatbutikkFeature[]>();
  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );
  const visibleFeatures = useMemo(
    () =>
      features?.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );

  function handleSourceChange() {
    setFeatures(layer?.getSource()?.getFeatures());
  }

  function handleViewChange() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    layer?.getSource()?.on("change", handleSourceChange);
    return () => layer?.getSource()?.un("change", handleSourceChange);
  }, [layer]);

  useEffect(() => {
    const view = map.getView();
    const handleViewChange = () => {
        setViewExtent(map.getView().getViewStateAndExtent().extent);
    };
    view.on("change:center", handleViewChange);
    view.on("change:resolution", handleViewChange);
    return () => {
      view.un("change:center", handleViewChange);
      view.un("change:resolution", handleViewChange);
    };
  }, [map, handleViewChange]);

  return { matbutikkLayer: layer, features, visibleFeatures, clearVisibleFeatures: () => setFeatures([])};
}

const MatbutikkAside = ({matbutikkAsideVisible} : {matbutikkAsideVisible: boolean}) => {
  const { map } = useContext(MapContext);
  const { visibleFeatures } = useMatbutikklayer();

    const [selectedStore, setSelectedStore] = useState<MatbutikkFeature | undefined>();
    const goToStore = (feature: MatbutikkFeature) => {
    const geometry = feature.getGeometry() as Polygon;
    const extent = geometry.getExtent();

    const [longitude, latitude] = getCenter(extent);
    map.getView().animate({ center: [longitude, latitude], zoom: 18 });
  };

  if (!matbutikkAsideVisible) return null;

  return (
    <aside
      className={visibleFeatures?.length ? "visible w-[30%] h-auto flex flex-col justify-start overflow-y-scroll pb-4 px-4" : "hidden"}
      style={{ maxHeight: "100vh", overflow: "auto" }}
    >
        <h2 className="text-xl font-bold">Synlige matbutikker</h2>
        {visibleFeatures?.map((b) => (
         <div
              key={b.getProperties().id}
              className={`dark:bg-slate-800 flex flex-row items-center justify-between py-1 px-4 my-1 w-full h-16 shadow ${selectedStore?.getProperties().id === b.getProperties().id ? "border-2 border-teal-600" : ""} rounded-lg`}
              role="button"
              tabIndex={0}
              onClick={() =>
                {setSelectedStore(
                    visibleFeatures.find((v) => b.getProperties().id === v.getProperties().id)
                  );
                    goToStore(b);
                }
              }
            >
              <div className="mr-2.5">{b.getProperties().name}</div>
              <img
                src={b.getProperties().logo}
                className="h-15 w-15 max-h-full max-w-full cursor-pointer"
                alt="Layer Thumbnail"
              />
            </div>
        ))}

    </aside>
  );
};

export default MatbutikkAside;
