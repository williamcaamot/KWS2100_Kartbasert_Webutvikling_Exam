import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, XYZ } from "ol/source";
import { MapContext } from "../modules/map/mapContext";

import satelliteLayerImage from "../assets/images/satelliteLayerImage.png";
import osmLayerImage from "../assets/images/openLayerstreetMapImage.png";
import stadiaLayerImage from "../assets/images/stadiaLayerImage.png";
import stadiaDarkLayerImage from "../assets/images/stadiaDarkLayerImage.png";
import kartverketLayerImage from "../assets/images/kartverketLayerImage.png";
import flyfotoLayerImage from "../assets/images/flyfotoLayerImage.png";

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
      name: "Stadia (dark)",
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
      name: "Satellite",
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
  >(extraLayerOptions[0]);
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
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          overflowY: "auto",
          paddingBottom: "40px",
        }}
      >
        {extraLayerOptions.map(({ id, name, imageUrl }) => {
          return (
            <div
              key={id}
              style={{
                padding: "15px",
                width: "90%",
                height: "80px",
                display: "flex",
                flexDirection: "row",
                margin: "5px",
                boxShadow: "0 0 5px rgba(0,0,0,0.15)",
                justifyContent: "space-between",
                alignItems: "center",
                border:
                  selectedExtraLayer && selectedExtraLayer.id === id
                    ? "2px solid #17a2b8"
                    : "none",
                borderRadius: "10px",
              }}
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
          <h3>Change the opacity</h3>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
          />
        </div>
      </div>
    </>
  );
}
