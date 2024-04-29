import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OGCVectorTile, OSM, StadiaMaps, WMTS, XYZ } from "ol/source";
import { MapContext } from "../modules/map/mapContext";
import { MVT, WMTSCapabilities } from "ol/format";
import { optionsFromCapabilities } from "ol/source/WMTS";

import satelliteLayerImage from "../assets/images/satelliteLayerImage.png";
import osmLayerImage from "../assets/images/openLayerstreetMapImage.png";
import stadiaLayerImage from "../assets/images/stadiaLayerImage.png";
import stadiaDarkLayerImage from "../assets/images/stadiaDarkLayerImage.png";
import kartverketLayerImage from "../assets/images/kartverketLayerImage.png";
import flyfotoLayerImage from "../assets/images/flyfotoLayerImage.png";
import OGCVectorTileLayerImage from "../assets/images/OGCVectorTileLayerImage.png";

import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import VectorTileLayer from "ol/layer/VectorTile";
import { Fill } from "ol/style";
import { Stroke, Style } from "ol/style.js";
import useLocalStorageState from "use-local-storage-state";

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

  const [ogcVectorTileColor, setOgcVectorTileColor] = useLocalStorageState(
    "ogc-vector-styles",
    {
      defaultValue: {
        background: "#d1d1d1",
        strokeWidth: 0.8,
        strokeColor: "#8c8b8b",
        fillColor: "#f7f7e9",
      },
    },
  );

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
    {
      id: "ogcVectorTile",
      name: "ogcVectorTile",
      layer: new VectorTileLayer({
        source: new OGCVectorTile({
          url: "https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:cultural:ne_10m_admin_0_countries/tiles/WebMercatorQuad",
          format: new MVT(),
        }),
        background: ogcVectorTileColor
          ? ogcVectorTileColor.background
          : "D1D1D1",
        style: new Style({
          stroke: new Stroke({
            color: ogcVectorTileColor
              ? ogcVectorTileColor.strokeColor
              : "#8c8b8b",
            width: ogcVectorTileColor ? ogcVectorTileColor.strokeWidth : 0.8,
          }),
          fill: new Fill({
            color: ogcVectorTileColor
              ? ogcVectorTileColor.fillColor
              : "#f7f7e9",
          }),
        }),
      }),
      imageUrl: OGCVectorTileLayerImage,
    },
  ];
  const [selectedLayer, setSelectedLayer] = useState(baseLayerOptions[0]);

  useEffect(() => {
    setBaseLayer(selectedLayer.layer);
  }, [selectedLayer]);

  useEffect(() => {
    if (selectedLayer.id === "ogcVectorTile") {
      const foundLayer = baseLayerOptions.find(
        (layer) => layer.id === "ogcVectorTile",
      );
      setSelectedLayer(foundLayer || baseLayerOptions[0]); // fallback to the first item if not found
    }
  }, [ogcVectorTileColor]);

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-start overflow-y-auto pt-0 pb-24">
        {baseLayerOptions.map(({ id, name, imageUrl }) => {
          return (
            <div
              key={id}
              className={`flex flex-row items-center justify-between p-4 my-1 w-full h-20 shadow ${selectedLayer.id === id ? "border-2 border-teal-600" : ""} rounded-lg`}
              onClick={() =>
                setSelectedLayer(
                  baseLayerOptions.find((l) => l.id === id) ||
                    baseLayerOptions[0],
                )
              }
            >
              <div className="mr-2.5">{name}</div>
              <img
                src={imageUrl}
                className="h-15 w-15 max-h-full max-w-full cursor-pointer"
                alt="Layer Thumbnail"
              />
            </div>
          );
        })}

        {selectedLayer.id === "ogcVectorTile" && (
          <>
            <h3 className={"font-bold text-2xl"}>Tilpass</h3>
            <div className={"flex flex-wrap"}>
              <div className={"w-full flex justify-center p-2"}>
                <span>Bakgrunn</span>
                <input
                  className={"mx-2"}
                  type={"color"}
                  value={ogcVectorTileColor.background}
                  onChange={(e) => {
                    setOgcVectorTileColor({
                      ...ogcVectorTileColor,
                      background: e.target.value,
                    });
                  }}
                />
              </div>
              <div className={"w-full flex justify-center p-2"}>
                <span>Fyll farge</span>
                <input
                  className={"mx-2"}
                  type={"color"}
                  value={ogcVectorTileColor.fillColor}
                  onChange={(e) => {
                    setOgcVectorTileColor({
                      ...ogcVectorTileColor,
                      fillColor: e.target.value,
                    });
                  }}
                />
              </div>
              <div className={"w-full flex justify-center p-2"}>
                <span>Linje farge</span>
                <input
                  className={"mx-2"}
                  type={"color"}
                  value={ogcVectorTileColor.strokeColor}
                  onChange={(e) => {
                    setOgcVectorTileColor({
                      ...ogcVectorTileColor,
                      strokeColor: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
