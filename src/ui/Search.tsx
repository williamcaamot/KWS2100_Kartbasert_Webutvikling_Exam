import React, { useContext, useEffect, useState } from "react";
import MapResultIcon from "./icons/MapResultIcon";
import { map, MapContext } from "../modules/map/mapContext";

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
        console.log(adresser);
        setResults(adresser);
      }
    } catch (e) {}
  }

  function handleFocusSearchResult(item: any) {
    console.log(item);
    map.getView().animate({
      center: [item.representasjonspunkt.lon, item.representasjonspunkt.lat],
      zoom: 18,
    });
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
                  className="w-full p-3 flex items-center hover:bg-gray-200 rounded-lg cursor-pointer transition-colors duration-150 ease-in-out"
                  onClick={() => {
                    handleFocusSearchResult(item);
                  }}
                >
                  <div className="mr-2">
                    <MapResultIcon size={16} color="#4B5563" />{" "}
                    {/* Replace LocationIcon with your actual icon component */}
                  </div>
                  <p className="m-0 text-gray-800 font-medium">
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
