import React, { useState, useEffect } from "react";
import MapLayerIcon from "./icons/MapLayerIcon";
import SearchIcon from "./icons/SearchIcon";
import Search from "./Search";
import DataLayerIcon from "./icons/DataLayerIcon";
import DrawIcon from "../ui/icons/DrawIcon";
import PointCreateIcon from "../ui/icons/PointCreateIcon";
import { SelectBaseLayer } from "./SelectBaseLayer";
import SettingsIcon from "./icons/SettingsIcon";
import {AdresseLayerCheckbox} from "../modules/layers/adresser/AdresseLayerCheckbox";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContent, setActiveContent] = useState(undefined);

  function handleContentChange(content: any) {
    if (content === activeContent) {
      setIsOpen(!isOpen);
      setActiveContent(undefined);
    } else {
      setIsOpen(true);
      setActiveContent(content);
    }
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
              <SearchIcon />
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
              <MapLayerIcon />
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
              <DataLayerIcon />
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
              <DrawIcon />
            </div>
            <h2 className={"text-xs"}>Tegning</h2>
          </div>
          <div
            className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "pointContent" && "bg-gray-200 inner-shadow !text-black"}`}
            onClick={(e) => {
              handleContentChange("pointContent");
            }}
          >
            <div className={"w-full flex justify-center"}>
              <PointCreateIcon />
            </div>
            <h2 className={"text-xs"}>Punkter</h2>
          </div>
          <div
            className={`cursor-pointer pb-2 pt-2 w-full flex flex-wrap justify-center hover:bg-gray-200 text-gray-700 hover:text-black transition duration-300 ease-in-out ${activeContent === "settingsContent" && "bg-gray-200 inner-shadow !text-black"}`}
            onClick={(e) => {
              handleContentChange("settingsContent");
            }}
          >
            <div className={"w-full flex justify-center"}>
              <SettingsIcon />
            </div>
            <h2 className={"text-xs"}>Innstillinger</h2>
          </div>
        </div>
      </div>

      <div
        className={`flex h-full fixed top-0 z-20 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-80"}`}
      >
        <div className="shadow-sm w-16 flex-shrink-0" />
        <div className="border-r shadow-lg w-64 md:w-80 p-3 bg-gray-50">
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
            <DataLayerContent />
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
              display: activeContent === "pointContent" ? "block" : "none",
            }}
          >
            <PointContent />
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
      <div className={"text-gray-800 flex justify-center flex-wrap "}>
        <h2
          className={
            "text-2xl tracking-tight font-semibold pb-2 text-zinc-800 mb-9"
          }
        >
          Background Layers
        </h2>
        <SelectBaseLayer />
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
      <AdresseLayerCheckbox/>
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

function PointContent() {
  return (
    <div className={"text-gray-800"}>
      <h2>Punkter</h2>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className={"text-gray-800"}>
      <h2>Innstillinger</h2>
    </div>
  );
}
