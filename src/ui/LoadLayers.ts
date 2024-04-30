import TileLayer from "ol/layer/Tile";
import { WMTS } from "ol/source";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { optionsFromCapabilities } from "ol/source/WMTS";

const parser = new WMTSCapabilities();

export const ortoPhotoLayer = new TileLayer();
export const kartverketLayer = new TileLayer();
export const polarLayer = new TileLayer();

export async function loadWtmsSource(
  url: string,
  config: { matrixSet: string; layer: string },
) {
  const res = await fetch(url);
  const text = await res.text();
  const result = parser.read(text);
  return new WMTS(optionsFromCapabilities(result, config)!);
}

export async function loadFlyfotoLayer() {
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

export async function loadKartverketLayer() {
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

export async function loadPolar() {
  try {
    const res = await fetch(
      "https://kristiania-kws2100-2024.github.io/kws2100-exam-williamcaamot/layers/polar-sdi.xml",
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const text = await res.text();
    console.log(text);

    const result = parser.read(text);
    console.log(result);

    const options = optionsFromCapabilities(result, {
      layer: "arctic_cascading",
      matrixSet: "3575",
    });
    // @ts-ignore
    return new WMTS(options)!;
  } catch (error) {
    console.error(error);
    return null;
  }
}
