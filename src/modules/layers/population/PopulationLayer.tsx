import React, { useContext } from "react";
import { useLayer } from "../../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Feature } from "ol";
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
  pop_mal: number;
  pop_fem: number;
  pop_ave2: number;
};

type PopulationFeature = {
  getProperties(): PopulationProperties;
} & Feature<MultiPolygon>;

export function populationStyle(f: FeatureLike) {
  const feature = f as PopulationFeature;
  const {
    pop_tot: population,
    pop_mal: male,
    pop_fem: female,
    pop_ave2: average,
  } = feature.getProperties();

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

  const style = new Style({
    fill: new Fill({ color: color }),
    text: new Text({
      text: ` Population: ${population}\n
            Male: ${male}\n
            Female: ${female}\n
            Average Age: ${average}`,
      font: "bold 12px sans-serif",
      stroke: new Stroke({ color: "white", width: 1.5 }),
      fill: new Fill({ color: "black" }),
    }),
  });

  return style;
}

export function PopulationLayer() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useLocalStorageState(
    "population-layer-checked",
    {
      defaultValue: false,
    },
  );

  useLayer(populationLayer, checked);

  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Vis befolknignstetthet</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}
