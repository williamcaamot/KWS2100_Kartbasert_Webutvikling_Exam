import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, VectorTile } from "ol";
import { Geometry, Polygon } from "ol/geom";
import { Projection } from "ol/proj";
import { Extent } from "ol/extent";

export type EiendomLayerType = VectorLayer<VectorSource<EiendomFeature>>;
export type EiendomFeature = {
  getProperties(): EiendomProperties;
} & Feature<Polygon>;

export interface EiendomProperties {
  matrikkelenhetid: string;
  matrikkel_kommunenummer: string;
  gardsnummer: string;
  bruksnummer: string;
  matrikkelenhetstype: string;
  kommunenavn: string;
}

export const EiendomLayer = new VectorLayer({
  className: "EiendomLayer",
  source: new VectorSource({
    strategy: (extent, resolution) => (resolution < 0.00002 ? [extent] : []),
    loader: function (extent, resolution, projection) {
      loadEiendomDataLayer(this, extent, resolution, projection);
    },
  }),
});

async function loadEiendomDataLayer(
  source: VectorSource<Feature<Geometry>> | VectorTile,
  extent: Extent,
  resolution: number,
  projection: Projection,
) {
  //console.log("fetching data");
  const url = `https://kartbasert-f2ca5a90ebbf.herokuapp.com/api/v1/datalayers/teig?extent=${JSON.stringify(extent)}&resolution=${resolution}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to load data");
    return;
  }
  // Remove existing features
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
