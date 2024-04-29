import { Layer } from "ol/layer";
import react, { useContext, useEffect } from "react";
import { MapContext } from "./mapContext";

export function useLayer(layer: Layer, checked: boolean) {
  const { setVectorLayers } = useContext(MapContext);

  useEffect(() => {
    if (checked) {
      setVectorLayers((old: Layer[]) => [...old, layer]);
    }
    return () => {
      setVectorLayers((old: Layer[]) => old.filter((l) => l !== layer));
    };
  }, [checked]);
}
