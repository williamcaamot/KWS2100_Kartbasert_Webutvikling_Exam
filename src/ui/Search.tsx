import React, { useContext, useEffect, useState } from "react";
import MapResultIcon from "./icons/MapResultIcon";
import { map, MapContext } from "../modules/map/mapContext";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export default function Search() {
  const { map } = useContext(MapContext);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [results, setResults] = useState<object[]>();

  const [tempSearch, setTempSearch] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  async function handleSearch() {
    try {
      if (searchTerm) {
        const res = await fetch(
          `https://ws.geonorge.no/adresser/v1/sok?sok=${searchTerm}&fuzzy=true&utkoordsys=4258&treffPerSide=30&side=0&asciiKompatibel=true`,
        );

        const { adresser, metadata } = await res.json();
        //console.log(adresser);
        setResults(adresser);
      }
    } catch (e) {}
  }

  function handleFocusSearchResult(item: any) {
    //console.log(item);
    map.getView().animate({
      center: [item.representasjonspunkt.lon, item.representasjonspunkt.lat],
      zoom: 18,
    });

    // Create a point geometry at your location
    const point = new Point([
        item.representasjonspunkt.lon,
        item.representasjonspunkt.lat,
      ]);

      // Create a feature with the point geometry
      const feature = new Feature(point);

      // Create a style for the feature
      const style = new Style({
        image: new Circle({
          radius: 14,
          fill: new Fill({ color: "rgba(0, 0, 230, 0.7)" }),
          stroke: new Stroke({
            color: "white",
            width: 4,
          }),
        }),
        text: new Text({
          text: item.adressetekst,
          offsetY: -30,
          fill: new Fill({ color: "black" }),
          stroke: new Stroke({ color: "white", width: 5 }),
        }),
      });

      // Set the style of the feature
      feature.setStyle(style);
  }

  //Debounce functionality
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id: any = setTimeout(() => {
      setTempSearch(searchTerm);
    }, 200);
    setTimeoutId(id);
  }, [searchTerm]);

  useEffect(() => {
    setIsSearchOpen(true);
    if (searchTerm.includes(tempSearch)) {
      handleSearch();
    }
  }, [tempSearch]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full overflow-y-scroll">
        <input
          autoFocus
          className="h-14 p-2 rounded-lg shadow-md w-full focus:outline-none focus:ring-indigo-400 mb-3"
          placeholder="Søk..."
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div
          className="overflow-y-scroll"
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          {results &&
            results.length &&
            results.map((item: any) => {
              return (
                <div
                  className="w-full p-3 flex items-center hover:bg-teal-600 rounded-lg cursor-pointer transition-colors duration-150 ease-in-out"
                  onClick={() => {
                    handleFocusSearchResult(item);
                  }}
                  key={item.id}
                >
                  <div className="mr-2 text-zinc-400">
                    <MapResultIcon size={20} />
                  </div>
                  <p className="m-0 font-medium dark:text-gray-50">
                    {item.adressetekst} {item.postnummer} {item.poststed}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
