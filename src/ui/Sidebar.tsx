import React, { useState } from "react";
import MapLayerIcon from "./icons/MapLayerIcon";
import SearchIcon from "./icons/SearchIcon";
import Search from "./Search";
import DataLayerIcon from "./icons/DataLayerIcon";
import DrawIcon from "../ui/icons/DrawIcon";
import { SelectBaseLayer } from "./SelectBaseLayer";
import SettingsIcon from "./icons/SettingsIcon";
import { AddressLayerCheckbox } from "../modules/layers/address/AddressLayerCheckbox";
import { PopulationLayer } from "../modules/layers/population/PopulationLayer";
import { MatbutikkerCheckbox } from "../modules/layers/foodStores/MatbutikkLayerCheckbox";
import { OverlayLayer } from "./OverlayLayer";
import MobilityLayer from "../modules/layers/mobility/MobilityLayer";
import TrainLayer from "../modules/layers/trains/TrainLayer";
import Settings from "../modules/userSettings/Settings";
import ResetIcon from "./icons/ResetIcon";
import { PropertyCheckbox } from "../modules/layers/properties/PropertyLayerCheckbox";
import Drawing from "../modules/drawing/Drawing";
import { KommuneLayerCheckbox } from "../modules/layers/kommuner/KommuneLayerCheckbox";
import { RailwayLayerCheckbox } from "../modules/layers/railwayLines/RailwayCheckbox";
import useReset from "./useReset";
import { PropertyLayer } from "../modules/layers/properties/PropertyLayer";

export default function Sidebar({
  setMatbutikkAsideVisible,
}: {
  setMatbutikkAsideVisible: (value: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContent, setActiveContent] = useState(undefined);

  const { handleReset } = useReset();

  function handleContentChange(content: any) {
    if (content === activeContent) {
      setIsOpen(!isOpen);
      setActiveContent(undefined);
    } else {
      setIsOpen(true);
      setActiveContent(content);
    }
  }

  const topMenuItems = [
    {
      id: "search",
      handleOnClick: () => handleContentChange("search"),
      icon: <SearchIcon />,
      text: "Søk",
    },
    {
      id: "layers",
      handleOnClick: () => handleContentChange("layers"),
      icon: <MapLayerIcon />,
      text: "Kart",
    },
    {
      id: "dataLayers",
      handleOnClick: () => handleContentChange("dataLayers"),
      icon: <DataLayerIcon />,
      text: "Data",
    },
    {
      id: "drawingContent",
      handleOnClick: () => handleContentChange("drawingContent"),
      icon: <DrawIcon />,
      text: "Tegning",
    },
  ];
  const bottomMenuItems = [
    {
      id: "reset",
      handleOnClick: () => handleReset(),
      icon: <ResetIcon />,
      text: "Reset",
    },
    {
      id: "settingsContent",
      handleOnClick: () => handleContentChange("settingsContent"),
      icon: <SettingsIcon />,
      text: "Innstillinger",
    },
  ];

  return (
    <>
      <div className="dark:bg-slate-900 h-full w-[80px] fixed top-0 z-30 flex flex-col items-center bg-white border-r dark:border-r-slate-950">
        {topMenuItems.map((menuItem) => {
          return (
            <>
              <div
                className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 dark:hover:bg-slate-700 dark:hover:text-white dark:text-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === menuItem.id && "bg-gray-200 dark:bg-slate-800 shadow-inner text-black !dark:text-white "}`}
                onClick={menuItem.handleOnClick}
                key={menuItem.id}
              >
                <div className={"w-full flex justify-center"}>
                  {menuItem.icon}
                </div>
                <h2 className={"text-xs"}>{menuItem.text}</h2>
              </div>
            </>
          );
        })}
        <div className="flex w-full h-full"></div>
        {bottomMenuItems.map((menuItem) => {
          return (
            <>
              <div
                className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 dark:hover:bg-slate-700 dark:hover:text-white dark:text-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === menuItem.id && "bg-gray-200 dark:bg-slate-800 shadow-inner text-black !dark:text-white "}`}
                onClick={menuItem.handleOnClick}
                key={menuItem.id}
              >
                <div className={"w-full flex justify-center"}>
                  {menuItem.icon}
                </div>
                <h2 className={"text-xs"}>{menuItem.text}</h2>
              </div>
            </>
          );
        })}
      </div>

      <div
        className={`flex h-full fixed top-0 z-20 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-80"}`}
      >
        <div className="shadow-sm w-[80px] flex-shrink-0" />
        <div className="border-r shadow-lg w-64 md:w-80 p-3 dark:bg-slate-900 bg-gray-50">
          <div
            style={{
              display: activeContent === "search" ? "block" : "none",
            }}
          >
            <SearchContent />
          </div>
          <div
            style={{
              display: activeContent === "layers" ? "block" : "none",
            }}
          >
            <LayerContent />
          </div>
          <div
            style={{
              display: activeContent === "dataLayers" ? "block" : "none",
            }}
          >
            <DataLayerContent
              setMatbutikkAsideVisible={setMatbutikkAsideVisible}
            />
          </div>
          <div
            style={{
              display: activeContent === "drawingContent" ? "block" : "none",
            }}
          >
            <DrawingContent />
          </div>
          <div
            style={{
              display: activeContent === "settingsContent" ? "block" : "none",
            }}
          >
            <SettingsContent />
          </div>
        </div>
      </div>
    </>
  );
}

function SearchContent() {
  return (
    <>
      <Search />
    </>
  );
}

function LayerContent() {
  return (
    <>
      <div className="h-full overflow-y-scroll flex flex-wrap">
        <div
          className={
            "dark:text-gray-200 text-gray-800 flex justify-center flex-wrap "
          }
        >
          <h2 className={"text-2xl tracking-tight font-semibold pb-1"}>
            Background Layers
          </h2>
          <SelectBaseLayer />
        </div>
        <div
          className={
            "dark:text-gray-200 text-gray-800 flex justify-center flex-wrap "
          }
        >
          <h2 className={"text-2xl tracking-tight font-semibold pb-1"}>
            Overlay layer (optional)
          </h2>
          <OverlayLayer />
        </div>
      </div>
    </>
  );
}

function DataLayerContent({
  setMatbutikkAsideVisible,
}: {
  setMatbutikkAsideVisible: (value: boolean) => void;
}) {
  return (
    <div
      className={
        "dark:text-gray-200 text-gray-800 flex justify-center flex-wrap"
      }
    >
      <h2 className={"text-2xl tracking-tight font-semibold pb-2"}>
        Data layers
      </h2>
      <PopulationLayer />
      <PropertyCheckbox />
      <AddressLayerCheckbox />
      <MatbutikkerCheckbox
        setMatbutikkAsideVisible={setMatbutikkAsideVisible}
      />
      <MobilityLayer />
      <TrainLayer />
      <RailwayLayerCheckbox />
      <KommuneLayerCheckbox />
    </div>
  );
}

function DrawingContent() {
  return (
    <div className={"h-full overflow-y-scroll"}>
      <div
        className={
          "dark:text-gray-200 text-gray-800 flex justify-center flex-wrap h-auto overflow-y-scroll"
        }
      >
        <h2 className={"text-2xl tracking-tight font-semibold pb-2"}>
          Tegning
        </h2>
        <Drawing />
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div
      className={
        "dark:text-gray-200 text-gray-800 flex justify-center flex-wrap"
      }
    >
      <h2 className={"text-2xl tracking-tight font-semibold pb-2"}>
        Instillinger
      </h2>
      <Settings />
    </div>
  );
}
