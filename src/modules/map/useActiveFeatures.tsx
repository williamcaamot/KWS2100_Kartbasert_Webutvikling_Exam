import { Feature, MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import {
  hoverMatbutikkStyleFunction,
  matbutikkStyleFunction,
} from "../../modules/layers/foodStores/MatbutikkLayer";

export function useActiveFeatures<FEATURE extends Feature>(
  predicate: (l: Layer) => boolean,
) {
  const { map, vectorLayers } = useContext(MapContext);

  const layer = useMemo(
    () => vectorLayers.find(predicate),
    [vectorLayers],
  ) as VectorLayer<VectorSource>;

  const [activeFeatures, setActiveFeatures] = useState<FEATURE[]>([]);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    console.log("handlePointerMove");
    const features = layer
      ?.getSource()
      ?.getFeaturesAtCoordinate(e.coordinate) as FEATURE[];

    //Added this, just remove if not needed
    layer
      ?.getSource()
      ?.getFeatures()
      .forEach((feature) => {
        feature.setStyle(matbutikkStyleFunction);
      });

    features?.forEach((feature) => {
      feature.setStyle(hoverMatbutikkStyleFunction);
    });

    setActiveFeatures((old) => {
      if (old.length === 1 && features.length === 1 && old[0] === features[0]) {
        return old;
      } else {
        return features || [];
      }
    });
  }
  useEffect(() => {
    //Console logging to see if the event is registered for
    console.log("map");
    console.log(layer);
    if (layer) {
      console.log("registering pointermove event");
      map.on("pointermove", handlePointerMove);
    }
    return () => {
      console.log("unregistering pointermove event");
      map.un("pointermove", handlePointerMove);
    };
  }, [layer]);

  return { activeFeatures, setActiveFeatures };
}
