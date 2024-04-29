import React, {useState, useEffect, useContext} from "react";
import MapLayerIcon from "./icons/MapLayerIcon";
import SearchIcon from "./icons/SearchIcon";
import Search from "./Search";
import DataLayerIcon from "./icons/DataLayerIcon";
import DrawIcon from "../ui/icons/DrawIcon";
import {SelectBaseLayer} from "./SelectBaseLayer";
import SettingsIcon from "./icons/SettingsIcon";
import {AdresseLayerCheckbox} from "../modules/layers/adresser/AdresseLayerCheckbox";
import {PopulationLayer} from "../modules/layers/population/PopulationLayer";
import {MatbutikkerCheckbox} from "../modules/layers/foodStores/MatbutikkLayerCheckbox";
import {ExtraMapLayer} from "./ExtraMapLayer";
import MobilityLayer from "../modules/layers/mobility/MobilityLayer";
import TrainLayer from "../modules/layers/trains/TrainLayer";
import Settings from "../modules/userSettings/Settings";
import useLocalStorageState from "use-local-storage-state";
import ResetIcon from "./icons/ResetIcon";
import {LoadingSpinner} from "./LoadingSpinner";
import {MapContext} from "../modules/map/mapContext";

export default function Sidebar() {
    const {loadingQueue} = useContext(MapContext)
    const [isOpen, setIsOpen] = useState(false);
    const [activeContent, setActiveContent] = useState(undefined);

    const [, setMobility] = useLocalStorageState("mobility-layer-checked", {
        defaultValue: false,
    });
    const [, setAddress] = useLocalStorageState("adresse-layer-checked", {
        defaultValue: false,
    });
    const [, setPopulation] = useLocalStorageState("population-layer-checked", {
        defaultValue: false,
    });
    const [, setTrain] = useLocalStorageState("train-layer-checked", {
        defaultValue: false,
    });
    const [, setOgcVectorTileColor] = useLocalStorageState("ogc-vector-styles", {
        defaultValue: {
            background: "#d1d1d1",
            strokeWidth: 0.8,
            strokeColor: "#8c8b8b",
            fillColor: "#f7f7e9",
        },
    });

    function handleContentChange(content: any) {
        if (content === activeContent) {
            setIsOpen(!isOpen);
            setActiveContent(undefined);
        } else {
            setIsOpen(true);
            setActiveContent(content);
        }
    }

    function handleReset() {
        setMobility(false);
        setAddress(false);
        setPopulation(false);
        setTrain(false);
        setOgcVectorTileColor({
            background: "#d1d1d1",
            strokeWidth: 0.8,
            strokeColor: "#8c8b8b",
            fillColor: "#f7f7e9",
        });
        window.location.reload();
    }

    return (
        <>
            <div className="h-full fixed top-0 z-30 flex flex-col w-16 items-center bg-white border-r">
                <div className="w-full flex flex-col">
                    <div
                        className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "search" && "bg-gray-200 inner-shadow !text-black"}`}
                        onClick={(e) => {
                            handleContentChange("search");
                        }}
                    >
                        <div className={"w-full flex justify-center"}>
                            <SearchIcon/>
                        </div>
                        <h2 className={"text-xs"}>Søk</h2>
                    </div>
                    <div
                        className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "layers" && "bg-gray-200 inner-shadow !text-black"}`}
                        onClick={(e) => {
                            handleContentChange("layers");
                        }}
                    >
                        <div className={"w-full flex justify-center"}>
                            <MapLayerIcon/>
                        </div>
                        <h2 className={"text-xs"}>Kart</h2>
                    </div>
                    <div
                        className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "dataLayers" && "bg-gray-200 inner-shadow !text-black"}`}
                        onClick={(e) => {
                            handleContentChange("dataLayers");
                        }}
                    >
                        <div className={"w-full flex justify-center"}>
                            <DataLayerIcon/>
                        </div>
                        <h2 className={"text-xs"}>Data</h2>
                    </div>
                    <div
                        className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "drawingContent" && "bg-gray-200 inner-shadow !text-black"}`}
                        onClick={(e) => {
                            handleContentChange("drawingContent");
                        }}
                    >
                        <div className={"w-full flex justify-center"}>
                            <DrawIcon/>
                        </div>
                        <h2 className={"text-xs"}>Tegning</h2>
                    </div>
                    <div
                        className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "settingsContent" && "bg-gray-200 inner-shadow !text-black"}`}
                        onClick={(e) => {
                            handleContentChange("settingsContent");
                        }}
                    >
                        <div className={"w-full flex justify-center"}>
                            <SettingsIcon/>
                        </div>
                        <h2 className={"text-xs"}>Innstillinger</h2>
                    </div>
                </div>
                <div
                    className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "settingsContent" && "bg-gray-200 inner-shadow !text-black"}`}
                    onClick={() => {
                        handleReset();
                    }}
                >
                    <div className={"w-full flex justify-center"}>
                        <ResetIcon/>
                    </div>
                    <h2 className={"text-xs"}>Reset</h2>
                </div>


                {/*The div below acts as a spacer*/}
                {loadingQueue.length > 0 &&
                    <>
                        <div className={"h-full"}></div>
                        <div
                            className={`pb-2 pt-2 w-full flex flex-wrap justify-center text-gray-700"}`}
                        >
                            <div className={"w-full p-2 flex justify-center"}>
                                <LoadingSpinner size={"40"}/>
                            </div>
                        </div>
                    </>
                }


            </div>

            <div
                className={`flex h-full fixed top-0 z-20 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-80"}`}
            >
                <div className="shadow-sm w-16 flex-shrink-0"/>
                <div className="border-r shadow-lg w-64 md:w-80 p-3 bg-gray-50">
                    <div
                        style={{
                            display: activeContent === "search" ? "block" : "none",
                        }}
                    >
                        <SearchContent/>
                    </div>
                    <div
                        style={{
                            display: activeContent === "layers" ? "block" : "none",
                        }}
                    >
                        <LayerContent/>
                    </div>
                    <div
                        style={{
                            display: activeContent === "dataLayers" ? "block" : "none",
                        }}
                    >
                        <DataLayerContent/>
                    </div>
                    <div
                        style={{
                            display: activeContent === "drawingContent" ? "block" : "none",
                        }}
                    >
                        <DrawingContent/>
                    </div>
                    <div
                        style={{
                            display: activeContent === "settingsContent" ? "block" : "none",
                        }}
                    >
                        <SettingsContent/>
                    </div>
                </div>
            </div>
        </>
    );
}

function SearchContent() {
    return (
        <>
            <Search/>
        </>
    );
}

function LayerContent() {
    return (
        <>
            <div className="h-full overflow-y-scroll flex flex-wrap">
                <div className={"text-gray-800 flex justify-center flex-wrap "}>
                    <h2
                        className={
                            "text-2xl tracking-tight font-semibold pb-2 text-zinc-800 mb-9"
                        }
                    >
                        Background Layers
                    </h2>
                    <SelectBaseLayer/>
                </div>

                <div className={"text-gray-800 flex justify-center flex-wrap "}>
                    <h2
                        className={
                            "text-2xl tracking-tight font-semibold pb-2 text-zinc-800 mb-9"
                        }
                    >
                        Extra Layers
                    </h2>
                    <ExtraMapLayer/>
                </div>
            </div>
        </>
    );
}

function DataLayerContent() {
    return (
        <div className={"text-gray-800 flex justify-center flex-wrap"}>
            <h2
                className={"text-2xl tracking-tight font-semibold pb-2 text-zinc-800"}
            >
                Data layers
            </h2>
            <MobilityLayer/>
            <AdresseLayerCheckbox/>
            <PopulationLayer/>
            <MatbutikkerCheckbox/>
            <TrainLayer/>
        </div>
    );
}

function DrawingContent() {
    return (
        <>
            <h2>Tegning</h2>
        </>
    );
}

function SettingsContent() {
    return (
        <div className={"text-gray-800 flex justify-center flex-wrap"}>
            <h2
                className={"text-2xl tracking-tight font-semibold pb-2 text-zinc-800"}
            >
                Instillinger
            </h2>
            <Settings/>
        </div>
    );
}
