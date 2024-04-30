import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, VectorTile } from "ol";
import { Geometry, Polygon } from "ol/geom";
import { Cluster } from "ol/source";
import { Circle, Fill } from "ol/style";
import { Circle as CircleStyle, Stroke, Style, Text } from "ol/style.js";
import { Extent } from "ol/extent";
import { Projection } from "ol/proj";
import { FeatureLike } from "ol/Feature";

export type AdresseLayerType = VectorLayer<VectorSource<AdresseFeature>>;
export type AdresseFeature = {
  getProperties(): AdresseProperties;
} & Feature<Polygon>;

export interface AdresseProperties {
  features: any;
  objid: string;
  objtype: string;
  adresseid: string;
  datauttaksdato: string;
  adressetekst: string;
  grunnkretsnummer: string;
  grunnkretsnavn: string;
  kommunenavn: string;
  kommunenummer: string;
  matrikkelnummeradresse_gardsnummer: string;
  matrikkelnummeradresse_bruksnummer: string;
  postnummer: string;
  poststed: string;
  organisasjonsnummer: string;
  soknenavn: string;
  tettstednavn: string;
  valgkretsnummer: string;
  valgkretsnavn: string;
  adressekode: string;
  adressenavn: string;
  nummer: string;
}

const clusterSource = new Cluster({
  distance: 40,
  minDistance: 5,
  source: new VectorSource({
    strategy: (extent, resolution) => (resolution < 0.0001 ? [extent] : []),
    loader: function (extent, resolution, projection) {
      loadAdresseLayer(this, extent, resolution, projection);
    },
  }),
});

export const AdresseLayer = new VectorLayer({
  className: "AdresseLayer",

  source: clusterSource,
  style: adresseStyle,
});

async function loadAdresseLayer(
  source: VectorSource<Feature<Geometry>> | VectorTile,
  extent: Extent,
  resolution: number,
  projection: Projection,
) {
  const url = `https://kartbasert-f2ca5a90ebbf.herokuapp.com/api/v1/datalayers/adresse?extent=${JSON.stringify(extent)}&resolution=${resolution}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to load data");
    return;
  }
  // Use the passed 'source' to clear existing features
  if (!(source instanceof VectorTile)) {
    source.clear();
  }
  const data = await response.json();

  const features = new GeoJSON().readFeatures(data, {
    dataProjection: "EPSG:4326",
    featureProjection: projection.getCode(),
  });

  // Add the new features to the source
  if (!(source instanceof VectorTile)) {
    source.addFeatures(features);
  }
}

function adresseStyle(f: FeatureLike) {
  const feature = f as AdresseFeature;

  const size = feature.get("features").length;

  return new Style({
    image: new CircleStyle({
      radius: styleRadius(feature.get("features").length),
      stroke: new Stroke({
        color: "#fff",
      }),
      fill: styleFill(size, feature),
    }),
    text: new Text({
      text: size.toString(),
      fill: new Fill({
        color: "#fff",
      }),
    }),
  });
}
//more info on colors: https://www.w3schools.com/html/html_colors_rgb.asp
function styleFill(featureLength: number, feature: AdresseFeature) {
  if (featureLength === 1) {
    const kommunenavn = feature.getProperties().features[0].values_.kommunenavn;
    // Zoom in on the border between these kommuner to see the difference
    // Probably not a very good real world usecase for this, but we have it to
    // demonstrate that we actually got this to work
    if (kommunenavn === "OSLO") {
      return new Fill({
        color: `rgb(8, 1, 207)`,
      });
    } else if (kommunenavn === "ASKER") {
      return new Fill({
        color: `rgb(213, 0, 0)`,
      });
    } else if (kommunenavn === "BÆRUM") {
      return new Fill({
        color: `rgb(48, 255, 0)`,
      });
    }
  }
  return new Fill({
    color: `rgba(95, 207, ${255 - featureLength / 2}, 1 )`,
  });
}
function styleRadius(featureLength: number) {
  if (featureLength < 12) return 12;
  if (12 + featureLength * 0.2 > 20) return 20;
  return 12 + featureLength * 0.2;
}
