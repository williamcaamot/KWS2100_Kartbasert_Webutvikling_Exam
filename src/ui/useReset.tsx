import { Coordinate } from "ol/coordinate";
import React from "react";
import useLocalStorageState from "use-local-storage-state";

export default function useReset() {
    const [, setMobility] = useLocalStorageState("mobility-layer-checked", {
        defaultValue: false,
      });
      const [, setAddress] = useLocalStorageState("adresse-layer-checked", {
        defaultValue: false,
      });
      const [, setPopulation] = useLocalStorageState("population-layer-checked", {
        defaultValue: false,
      });
      const [, setTrain] = useLocalStorageState("train-layer-checked", {
        defaultValue: false,
      });
      const [, setMatbutikker] = useLocalStorageState("matbutikk-layer-checked", {
        defaultValue: false,
      });
      const [, setKommuner] = useLocalStorageState("kommuner-layer-checked", {
        defaultValue: false,
      });
      const [, setOgcVectorTileColor] = useLocalStorageState("ogc-vector-styles", {
        defaultValue: {
          background: "#d1d1d1",
          strokeWidth: 0.8,
          strokeColor: "#8c8b8b",
          fillColor: "#f7f7e9",
        },
      });
      const [, setRailways] = useLocalStorageState("railway-layer-checked", {
        defaultValue: false,
      });
      const [, setSavedView] = useLocalStorageState<{
        center: Coordinate;
        zoom: number;
      } | null>("saved-view");

      function handleReset() {
        setMobility(false);
        setAddress(false);
        setPopulation(false);
        setTrain(false);
        setMatbutikker(false);
        setKommuner(false);
    
        setOgcVectorTileColor({
          background: "#d1d1d1",
          strokeWidth: 0.8,
          strokeColor: "#8c8b8b",
          fillColor: "#f7f7e9",
        });
        setRailways(false);
        setSavedView(null);
        window.location.reload();
      }

        return {
            handleReset
        }

}