import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../../map/useLayer";
import { MapContext } from "../../map/mapContext";
import { MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import Switch from "../../../ui/switch";

import {
  RailwayFeature,
  activeRailwayStyle,
  railwayStyle,
} from "./RailwayFeature";

const railwayLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100-exam-williamcaamot/layers/jernbanelinjer-N50.json",
    format: new GeoJSON(),
  }),
  style: railwayStyle,
  className: "railway",
});

export function RailwayLayerCheckbox() {
  const { map } = useContext(MapContext);

  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<RailwayFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === railwayLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as RailwayFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeRailwayStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  useLayer(railwayLayer, checked);

  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Railwaylines N50</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}
