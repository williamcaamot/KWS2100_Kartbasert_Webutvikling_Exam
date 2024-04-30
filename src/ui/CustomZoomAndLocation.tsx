import React, {useContext} from "react";

import ZoomToUser from "./icons/ZoomToUser";
import ZoomInIcon from "./icons/ZoomInIcon";
import ZoomOutIcon from "./icons/ZoomOutIcon";
import {MapContext} from "../modules/map/mapContext";

import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import {Circle, Fill, Stroke, Style, Text} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {fromLonLat} from "ol/proj";

export default function CustomZoomAndLocation() {
    const {map} = useContext(MapContext);

    function handleZoomIn() {
        const zoom = map.getView().getZoom();
        if (zoom !== undefined) {
            map.getView().animate({zoom: zoom + 1, duration: 150});
        }
    }

    function handleZoomOut() {
        const zoom = map.getView().getZoom();
        if (zoom !== undefined) {
            map.getView().animate({zoom: zoom - 1, duration: 150});
        }
    }

    function handleFocusUser() {
        navigator.geolocation.getCurrentPosition((pos) => {
            const {latitude, longitude} = pos.coords;
            map.getView().animate({
                center: [longitude, latitude],
                zoom: 18,
            });

            const marker = new Feature({
                geometry: new Point([longitude, latitude]),
            });

            marker.setStyle(
                new Style({
                    image: new Circle({
                        radius: 14,
                        fill: new Fill({color: "rgba(0, 0, 230, 0.7)"}),
                        stroke: new Stroke({
                            color: "white",
                            width: 4,
                        }),
                    }),
                    text: new Text({
                        text: "Your Position",
                        offsetY: -30,
                        fill: new Fill({color: "black"}),
                        stroke: new Stroke({color: "white", width: 5}),
                    }),
                }),
            );

            const vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: [marker],
                }),
            });
            map.addLayer(vectorLayer);
        });
    }

    return (
        <>
            <div
                className={
                    "fixed zoom-button-shadow rounded-md bottom-8 right-2 h-auto w-auto border-neutral-300 dark:bg-slate-900 bg-white z-20"
                }
            >
                <div
                    onClick={handleFocusUser}
                    className={
                        "p-1 pt-1 active:shadow-innner-xl rounded-t-md cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                    }
                >
                    <div className={"dark:text-white"}>
                        <ZoomToUser size={20}/>
                    </div>

                </div>
                <div
                    onClick={handleZoomIn}
                    className={
                        "p-1 active:shadow-innner-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                    }
                >
                    <div className={"dark:text-white"}>
                        <ZoomInIcon size={20}/>
                    </div>
                </div>
                <div
                    onClick={handleZoomOut}
                    className={
                        "p-1 pb-1 active:shadow-innner-xl rounded-b-md cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                    }
                >
                    <div className={"dark:text-white"}>
                        <ZoomOutIcon size={20}/>
                    </div>
                </div>
            </div>
        </>
    );
}
