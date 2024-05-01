import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, VectorTile } from "ol";
import { Geometry, Polygon } from "ol/geom";
import { Icon } from "ol/style";
import { Style } from "ol/style.js";
import { Extent } from "ol/extent";
import { Projection } from "ol/proj";


export type FoodstoreLayerType = VectorLayer<VectorSource<FoodstoreFeature>>;
export type FoodstoreFeature = {
  getProperties(): FoodstoreProperties;
} & Feature<Polygon>;

export interface FoodstoreProperties {
  id: string;
  group_name: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  logo: string;
  website: string;
  detail_url: string;
  opening_hours: Object; //TODO create openin hours interface
}

export const FoodstoreLayer = new VectorLayer({
  className: "MatbutikkerLayer",
  source: new VectorSource({
    strategy: (extent, resolution) => (resolution < 0.001 ? [extent] : []),
    loader: function (extent, resolution, projection) {
      loadFoodstoreLayer(this, extent, resolution, projection);
    },
  }),
  style: foodstoreStyleFunction,
});

async function loadFoodstoreLayer(
  source: VectorSource<Feature<Geometry>> | VectorTile,
  extent: Extent,
  resolution: number,
  projection: Projection,
) {
  const url = `https://kartbasert-f2ca5a90ebbf.herokuapp.com/api/v1/datalayers/matbutikker?extent=${JSON.stringify(extent)}&resolution=${resolution}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to load data");
    return;
  }
  if (!(source instanceof VectorTile)) {
    source.clear();
  }
  const data = await response.json();

  const features = new GeoJSON().readFeatures(data, {
    dataProjection: "EPSG:4326",
    featureProjection: projection.getCode(),
  });

  if (!(source instanceof VectorTile)) {
    source.addFeatures(features);
  }
}

export function foodstoreStyleFunction(feature: any, resolution: any): Style {
  const properties = feature.getProperties();
  const logoUrl = properties.logo;

  return new Style({
    image: new Icon({
      src: logoUrl,
      scale: 0.19,
      anchor: [0.5, 0.5],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
    }),
  });
}

export function FoodstoreHoverStyleFunction(
  feature: any,
  resolution: any,
): Style {
  const properties = feature.getProperties();
  const logoUrl = properties.logo;

  return new Style({
    image: new Icon({
      src: logoUrl,
      scale: 1.3,
      anchor: [0.5, 0.5],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
    }),
  });
}
