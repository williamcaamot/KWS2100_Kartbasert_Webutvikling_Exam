import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Feature} from "ol";
import {Polygon} from "ol/geom";
import {Fill, Stroke, Style} from "ol/style";



export interface StedsNavn {
    sprak: "nor" | "sma" | "sme" | "smj" | "fkv";
    navn: string;
}

export function getStedsnavn({navn}: { navn: StedsNavn[] }) {
    return navn.find((n) => n.sprak === "nor")!.navn;
}


export type KommuneLayer = VectorLayer<VectorSource<KommuneFeature>>;
export type KommuneFeature = {
    getProperties(): KommuneProperties;
} & Feature<Polygon>;

export interface KommuneProperties {
    kommunenummer: string;
    navn: StedsNavn[];
}

export const kommuneLayer = new VectorLayer({
    className: "kommuner",
    source: new VectorSource({
        url: "/kws2100-exam-williamcaamot/layers/kommuner.json",
        format: new GeoJSON(),
    }),
    style: new Style({
        fill: new Fill({color:"rgba(217,79,185,0.1)"}),
        stroke: new Stroke({color:"green"})
    })
});