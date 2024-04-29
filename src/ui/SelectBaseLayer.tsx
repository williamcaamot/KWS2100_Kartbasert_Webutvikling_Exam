import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, WMTS, XYZ } from "ol/source";
import { MapContext } from "../modules/map/mapContext";
import { WMTSCapabilities } from "ol/format";
import { optionsFromCapabilities } from "ol/source/WMTS";

import satelliteLayerImage from "../assets/images/satelliteLayerImage.png";
import osmLayerImage from "../assets/images/openLayerstreetMapImage.png";
import stadiaLayerImage from "../assets/images/stadiaLayerImage.png";
import stadiaDarkLayerImage from "../assets/images/stadiaDarkLayerImage.png";
import kartverketLayerImage from "../assets/images/kartverketLayerImage.png";
import flyfotoLayerImage from "../assets/images/flyfotoLayerImage.png";

import proj4 from "proj4";
import { register } from "ol/proj/proj4";

proj4.defs([
  [
    "EPSG:3571",
    "+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
  [
    "EPSG:3575",
    "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
]);
register(proj4);

//test

const parser = new WMTSCapabilities();

const ortoPhotoLayer = new TileLayer();
const kartverketLayer = new TileLayer();
const polarLayer = new TileLayer();

// @ts-ignore
async function loadFlyfotoLayer() {
  const res = await fetch(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
  );
  const text = await res.text();

  const result = parser.read(text);
  const options = optionsFromCapabilities(result, {
    layer: "Nibcache_web_mercator_v2",
    matrixSet: "default028mm",
  });
  // @ts-ignore
  return new WMTS(options)!;
}

async function loadKartverketLayer() {
  const res = await fetch(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
  );
  const text = await res.text();

  const result = parser.read(text);
  const options = optionsFromCapabilities(result, {
    layer: "norgeskart_bakgrunn",
    matrixSet: "EPSG:3857",
  });
  // @ts-ignore
  return new WMTS(options)!;
}

export function SelectBaseLayer() {
  const { setBaseLayer, map } = useContext(MapContext);

  useEffect(() => {
    loadFlyfotoLayer().then((source) => ortoPhotoLayer.setSource(source));

    loadKartverketLayer().then((source) => kartverketLayer.setSource(source));
  }, []);

  const baseLayerOptions = [
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
      id: "kartverket",
      name: "Kartverket",
      preload: Infinity,
      layer: kartverketLayer,
      imageUrl: kartverketLayerImage,
    },
    {
      id: "ortophoto",
      name: "Flyfoto",
      preload: Infinity,
      layer: ortoPhotoLayer,
      imageUrl: flyfotoLayerImage,
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
  const [selectedLayer, setSelectedLayer] = useState(baseLayerOptions[0]);

  useEffect(() => {
    // @ts-ignore
    setBaseLayer(selectedLayer.layer);
  }, [selectedLayer]);

  // @ts-ignore
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          overflowY: "auto",
          paddingTop: "0",
          paddingBottom: "100px",
        }}
      >
        {baseLayerOptions.map(({ id, name, imageUrl }) => {
          return (
            <div
              key={id}
              style={{
                padding: "15px",
                width: "100%",
                height: "80px",
                display: "flex",
                flexDirection: "row",
                margin: "5px",
                boxShadow: "0 0 5px rgba(0,0,0,0.15)",
                justifyContent: "space-between",
                alignItems: "center",
                border: selectedLayer.id === id ? "2px solid #17a2b8" : "none",
                borderRadius: "10px",
              }}
              onClick={() =>
                setSelectedLayer(
                  baseLayerOptions.find((l) => l.id === id) ||
                    baseLayerOptions[0],
                )
              }
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
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
