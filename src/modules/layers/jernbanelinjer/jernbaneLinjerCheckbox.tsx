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
  JernbanelinjerFeature,
  activeJernbanelinjerStyle,
  jernbaneLinjerStyle,
} from "./jernbaneLinjerFeature";

const jernbaneLinjerLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100-exam-williamcaamot/layers/jernbanelinjer-N50.json",
    format: new GeoJSON(),
  }),
  style: jernbaneLinjerStyle,
  className: "jernbanelinjer",
});

export function JernbaneLinjerLayerCheckbox() {
  const { map } = useContext(MapContext);

  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<JernbanelinjerFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === jernbaneLinjerLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as JernbanelinjerFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeJernbanelinjerStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  useLayer(jernbaneLinjerLayer, checked);

  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Jernbanelinjer N50</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}
