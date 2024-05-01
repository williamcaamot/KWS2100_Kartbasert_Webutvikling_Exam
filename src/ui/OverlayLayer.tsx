import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, XYZ } from "ol/source";
import { MapContext } from "../modules/map/mapContext";

import satelliteLayerImage from "../assets/images/satelliteLayerImage.png";
import osmLayerImage from "../assets/images/openLayerstreetMapImage.png";
import stadiaLayerImage from "../assets/images/stadiaLayerImage.png";
import stadiaDarkLayerImage from "../assets/images/stadiaDarkLayerImage.png";

export function OverlayLayer() {
  const { map } = useContext(MapContext);

  const extraLayerOptions = [
    {
      id: "osm",
      name: "Open Street Map",
      layer: new TileLayer({ source: new OSM(), preload: Infinity }),
      imageUrl: osmLayerImage,
    },
    {
      id: "stadia",
      name: "Stadia",
      layer: new TileLayer({
        source: new StadiaMaps({
          layer: "outdoors",
          apiKey: "633c90e4-0e65-4f2f-a997-0c7bf8423ece",
        }),
        preload: Infinity,
      }),
      imageUrl: stadiaLayerImage,
    },
    {
      id: "stadia_dark",
      name: "Stadia (mørk))",
      layer: new TileLayer({
        source: new StadiaMaps({
          layer: "alidade_smooth_dark",
          apiKey: "633c90e4-0e65-4f2f-a997-0c7bf8423ece",
          retina: true,
        }),
        preload: Infinity,
      }),
      imageUrl: stadiaDarkLayerImage,
    },
    {
      id: "satellite",
      name: "Global flyfoto",
      layer: new TileLayer({
        source: new XYZ({
          attributions:
            "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          maxZoom: 19,
        }),
        preload: Infinity,
      }),
      imageUrl: satelliteLayerImage,
    },
  ];

  const [selectedExtraLayer, setSelectedExtraLayer] = useState<
    (typeof extraLayerOptions)[0] | null
  >(null);

  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    if (map && selectedExtraLayer) {
      const extraLayer = selectedExtraLayer.layer;
      extraLayer.setOpacity(opacity);
      extraLayer.setZIndex(1);

      map.addLayer(extraLayer);

      return () => {
        map.removeLayer(extraLayer);
      };
    }
  }, [selectedExtraLayer, map, opacity]);

  return (
    <>
      <div
        className={
          "w-[90%] h-auto flex flex-col justify-start overflow-y-scroll pb-4"
        }
      >
        {extraLayerOptions.map(({ id, name, imageUrl }) => {
          return (
            <div
              key={id}
              className={`dark:bg-slate-800 flex flex-row items-center justify-between py-1 px-4 my-1 w-full h-16 shadow ${selectedExtraLayer?.id === id ? "border-2 border-teal-600" : ""} rounded-lg`}
              onClick={() => {
                setSelectedExtraLayer((currentLayer) =>
                  currentLayer && currentLayer.id === id
                    ? null
                    : extraLayerOptions.find((l) => l.id === id) || null,
                );
              }}
            >
              <div style={{ marginRight: "10px" }}>{name}</div>

              <img
                src={imageUrl}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  height: "60px",
                  width: "60px",
                  cursor: "pointer",
                }}
                alt={name}
              />
            </div>
          );
        })}
        <div>
          <div className={"w-full flex justify-center flex-wrap py-2"}>
          <h3>Endre gjennomsiktighet</h3>
          <input
            type="range"
            min="0"
            step="0.05"
            max="1"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
          />
          </div>
        </div>
      </div>
    </>
  );
}
