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

function useMatbutikklayer() {
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
      setViewExtent(view.calculateExtent(map.getSize()));
    };
    view.on("change:center", handleViewChange);
    view.on("change:resolution", handleViewChange);
    return () => {
      view.un("change:center", handleViewChange);
      view.un("change:resolution", handleViewChange);
    };
  }, [map, handleViewChange]);

  return { matbutikkLayer: layer, features, visibleFeatures };
}

const MatbutikkAside = () => {
  const { map } = useContext(MapContext);
  const { visibleFeatures } = useMatbutikklayer();
  const { activeFeatures, setActiveFeatures } =
    useActiveFeatures<MatbutikkFeature>(
      (l) => l.getClassName() === "MatbutikkerLayer",
    );

  const goToStore = (feature: MatbutikkFeature) => {
    const geometry = feature.getGeometry() as Polygon;
    const extent = geometry.getExtent();

    const [longitude, latitude] = getCenter(extent);
    map.getView().animate({ center: [longitude, latitude], zoom: 18 });
  };

  return (
    <aside
      className={visibleFeatures?.length ? "visible" : "hidden"}
      style={{ maxHeight: "100vh", overflow: "auto" }}
    >
      <div>
        <h2>Matbutikker</h2>
        <ul onMouseLeave={() => setActiveFeatures([])}>
          {visibleFeatures?.map((b) => (
            <li
              key={b.getProperties().id}
              onClick={() => goToStore(b)}
              className={activeFeatures.includes(b) ? "active" : ""}
            >
              {b.getProperties().name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default MatbutikkAside;
