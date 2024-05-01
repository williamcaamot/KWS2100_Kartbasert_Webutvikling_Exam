import React, { useContext, useEffect, useState } from "react";
import { MapBrowserEvent, Overlay } from "ol";
import { useLayer } from "../../map/useLayer";
import { MapContext } from "../../map/mapContext";
import {
  AddressFeature,
  AddressLayer,
  AddressProperties,
  addressStyle,
  addressHoverStyle,
} from "./AddressLayer";
import Switch from "../../../ui/switch";
import useLocalStorageState from "use-local-storage-state";
import {
  mobilityActiveStyle,
  mobilityStyle,
} from "../mobility/MobilityFeature";

export function AddressLayerCheckbox() {
  const [checked, setChecked] = useLocalStorageState("adresse-layer-checked", {
    defaultValue: false,
  });

  const { map } = useContext(MapContext);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 1000) {
      return;
    }

    var featuresAtCoordiante = map.forEachFeatureAtPixel(
      e.pixel,
      function (feature) {
        return feature as AddressFeature;
      },
    );
    const coordinate = e.coordinate;
    popup.setPosition(coordinate);
    //console.log(`amount of features: ${featuresAtCoordiante?.getProperties().features.length}`)
    if (!featuresAtCoordiante?.getProperties().features) {
      return;
    }
    if (featuresAtCoordiante?.getProperties().features.length === 1) {
      //console.log("Adding single feature")
      const singleFeature = featuresAtCoordiante?.getProperties()
        .features[0] as AddressFeature;
      const singleFeatureProperties =
        singleFeature.getProperties() as AddressProperties;
      popupElement.innerHTML = `
<div class="w-full h-full dark:bg-slate-900 border-slate-950 bg-white text-black dark:text-white p-4 rounded">
            <span>
            <div class="w-full flex justify-center pb-2 underline"><h3 class="font-bold">Adresse informasjon</h3></div>
          <ul>
          
            <li><span class="font-bold">Adresse:</span> ${singleFeatureProperties.adressetekst}</li>
            <li><span class="font-bold">Kommunenavn:</span> ${singleFeatureProperties.kommunenavn} ${singleFeatureProperties.postnummer}</li>
            <li><span class="font-bold">Objekttype:</span> ${singleFeature?.getProperties().objtype}</li>
            <li><span class="font-bold">Grunnkretsnavn:</span> ${singleFeature?.getProperties().grunnkretsnavn}</li>
            <li><span class="font-bold">Grunnkretsnummer:</span> ${singleFeature?.getProperties().grunnkretsnummer}</li>
            <li><span class="font-bold">Tettstedsnavn:</span> ${singleFeature?.getProperties().tettstednavn}</li>
            <li><span class="font-bold">Valgkretsnavn:</span> ${singleFeature?.getProperties().valgkretsnavn}</li>
            <li><span class="font-bold">Kommunenummer:</span> ${singleFeature?.getProperties().kommunenummer}</li>
            <li><span class="font-bold">Gårdsnummer:</span> ${singleFeature?.getProperties().matrikkelnummeradresse_gardsnummer}</li>
            <li><span class="font-bold">Bruksnummer:</span> ${singleFeature?.getProperties().matrikkelnummeradresse_bruksnummer}</li>
            </ul>
          </span>
          </div>
            `;
      popupElement.style.display = "block";
    } else if (featuresAtCoordiante?.getProperties().features.length > 1) {
      const coordinates =
        featuresAtCoordiante?.getProperties().geometry.flatCoordinates;
      if (map?.getView()?.getZoom() !== undefined) {
        const currentZoom = map.getView().getZoom();
        const view = map.getView();
        if (currentZoom !== undefined && view) {
          view.animate({
            zoom: currentZoom + 1,
            duration: 300,
            center: [coordinates[0], coordinates[1]],
          });
        }
      }

      return;
    }
  }

  const popupElement = document.createElement("div");
  popupElement.style.backgroundColor = "white";
  popupElement.style.border = "1px solid black";
  popupElement.style.display = "none";
  popupElement.className = "dark:bg-gray-800";
  document.body.appendChild(popupElement);

  const popup = new Overlay({
    element: popupElement,
  });
  map.addOverlay(popup);

  let selected: AddressFeature;

  const [activeFeature, setActiveFeature] = useState();

  map.on("pointermove", function (e) {
    popupElement.style.display = "none";
  });

  // Effect for adding and removing onclick

  useEffect(() => {
    if (checked) {
      map?.on("click", handleClick);
    }
    return () => map?.un("click", handleClick);
  }, [checked]);

  useLayer(AddressLayer, checked);

  return (
    <div className="flex w-full justify-around p-1 flex-col">
      <div className={"flex w-full justify-around"}>
        <p>Vis adresser</p>
        <div className={"flex-1"}></div>
        <Switch checked={checked} onChange={setChecked} />
      </div>
      <p className="text-yellow-500">
        {checked ? "(Obs! Krever zoom)" : undefined}
      </p>
    </div>
  );
}
