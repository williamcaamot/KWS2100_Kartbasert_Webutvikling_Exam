import React, {useContext} from "react";

import ZoomToUser from "./icons/ZoomToUser";
import ZoomInIcon from "./icons/ZoomInIcon";
import ZoomOutIcon from "./icons/ZoomOutIcon";
import {MapContext} from "../modules/map/mapContext";

export default function CustomZoomAndLocation() {

    const {map} = useContext(MapContext)

    function handleZoomIn() {
        const zoom = map.getView().getZoom();
        if (zoom !== undefined) {
            map.getView().animate({zoom: zoom + 1, duration: 150});
        }
    }

    function handleZoomOut() {
        const zoom = map.getView().getZoom();
        if (zoom !== undefined) {
            map.getView().animate({zoom: (zoom - 1), duration: 150})
        }
    }

    function handleFocusUser() {
        navigator.geolocation.getCurrentPosition((pos) => {
            const {latitude, longitude} = pos.coords;
            map.getView().animate({
                center: [longitude, latitude],
                zoom: 12,
            });
        });
    }

    return <>
        <div
            className={"fixed zoom-button-shadow rounded-md bottom-8 right-2 h-auto w-auto border-neutral-300 bg-white z-20"}>
            <div onClick={handleFocusUser}
                 className={"p-1 pt-1 active:shadow-innner-xl rounded-t-md cursor-pointer hover:bg-gray-100"}>
                <ZoomToUser size={20}/></div>
            <div onClick={handleZoomIn} className={"p-1 active:shadow-innner-xl cursor-pointer hover:bg-gray-100"}>
                <ZoomInIcon size={20}/></div>
            <div onClick={handleZoomOut}
                 className={"p-1 pb-1 active:shadow-innner-xl rounded-b-md cursor-pointer hover:bg-gray-100"}>
                <ZoomOutIcon size={20}/></div>
        </div>

    </>


}