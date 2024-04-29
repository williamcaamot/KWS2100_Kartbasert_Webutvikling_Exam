import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, VectorTile } from "ol";
import { Geometry, Polygon } from "ol/geom";
import { Cluster } from "ol/source";
import { Fill } from "ol/style";
import { Circle as CircleStyle, Stroke, Style, Text } from "ol/style.js";
import { Extent } from "ol/extent";
import { Projection } from "ol/proj";

export type AdresseLayerType = VectorLayer<VectorSource<AdresseFeature>>;
export type AdresseFeature = {
    getProperties(): AdresseProperties;
} & Feature<Polygon>;

export interface AdresseProperties {
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
    style: function (feature) {
        const size = feature.get("features").length;
        const style = new Style({
            image: new CircleStyle({
                radius: 12,
                stroke: new Stroke({
                    color: "#fff",
                }),
                fill: new Fill({
                    color: "#3399CC",
                }),
            }),
            text: new Text({
                text: size.toString(),
                fill: new Fill({
                    color: "#fff",
                }),
            }),
        });
        return style;
    },
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
