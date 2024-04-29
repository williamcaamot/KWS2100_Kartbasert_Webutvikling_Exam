import React, { useContext, useEffect, useState } from "react";
import { useLayer } from "../../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature, MapBrowserEvent } from "ol";
import { MultiPolygon } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { MapContext } from "../../map/mapContext";
import useLocalStorageState from "use-local-storage-state";
import Switch from "../../../ui/switch";

const populationLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100-exam-williamcaamot/layers/Population.json",
    format: new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    }),
  }),
  style: populationStyle,
});
type PopulationProperties = {
  pop_tot: number;
};

type PopulationFeature = {
  getProperties(): PopulationProperties;
} & Feature<MultiPolygon>;

function populationStyle(f: FeatureLike) {
  const feature = f as PopulationFeature;
  const population = feature.getProperties().pop_tot;

  let color;
  if (population > 19000) {
    color = "rgba(0, 0, 0, 0.5)";
  } else if (population > 12000) {
    color = "rgba(128, 0, 0, 0.5)";
  } else if (population > 5000) {
    color = "rgba(255, 165, 0, 0.5)";
  } else if (population > 1000) {
    color = "rgba(0, 128, 0, 0.5)";
  } else {
    color = "rgba(255, 255, 0, 0.5)";
  }

  return new Style({
    fill: new Fill({ color: color }),
  });
}

export function PopulationLayer() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useLocalStorageState(
    "population-layer-checked",
    {
      defaultValue: false,
    },
  );

  const [activeFeature, setActiveFeature] = useState<PopulationFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === populationLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as PopulationFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useLayer(populationLayer, checked);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Show population</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}
