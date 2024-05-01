import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../../map/mapContext";
import Switch from "../../../ui/switch";
import { EiendomFeature, EiendomLayer } from "./EiendomLayer";
import { MapBrowserEvent, Overlay } from "ol";
import { useLayer } from "../../map/useLayer";
import useLocalStorageState from "use-local-storage-state";
import { TrainFeature } from "../trains/TrainFeature";
import { AdresseFeature } from "../adresser/AdresseLayer";

export function EiendomCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useLocalStorageState("eiendom-layer-checked", {
    defaultValue: false,
  });

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 1000) {
      return;
    }

    var featuresAtCoordinate = map.forEachFeatureAtPixel(
      e.pixel,
      function (feature) {
        return feature as EiendomFeature;
      },
    );

    // Show the popup here
    const coordinate = e.coordinate;
    popup.setPosition(coordinate);
    if (featuresAtCoordinate?.getProperties().matrikkelenhetid) {
      popupElement.innerHTML = `
          <span>
          <ul>
            <li><span class="font-bold">MatrikkelenhetID:</span> ${featuresAtCoordinate?.getProperties().matrikkelenhetid}</li>
            <li><span class="font-bold">Kommunenummer:</span> ${featuresAtCoordinate?.getProperties().matrikkel_kommunenummer}</li>
            <li><span class="font-bold">Gårdsnummer:</span> ${featuresAtCoordinate?.getProperties().gardsnummer}</li>
            <li><span class="font-bold">Bruksnummer:</span> ${featuresAtCoordinate?.getProperties().bruksnummer}</li>
            <li><span class="font-bold">Kommunenavn:</span> ${featuresAtCoordinate?.getProperties().kommunenavn}</li>
            <li><span class="font-bold">Enhetstype:</span> ${featuresAtCoordinate?.getProperties().matrikkelenhetstype}</li>
            </ul>
          </span>
        `;
      popupElement.style.display = "block";
    }
  }

  const popupElement = document.createElement("div");
  popupElement.style.backgroundColor = "white";
  popupElement.style.padding = "10px";
  popupElement.style.borderRadius = "5px";
  popupElement.style.border = "1px solid black";
  popupElement.style.display = "none";
  document.body.appendChild(popupElement);

  const popup = new Overlay({
    element: popupElement,
  });
  map.addOverlay(popup);

  map.on("pointermove", function () {
    popupElement.style.display = "none";
  });

  useLayer(EiendomLayer, checked);

  // Effect for adding and removing onclick
  useEffect(() => {
    if (checked) {
      map?.on("click", handleClick);
    }
    return () => map?.un("click", handleClick);
  }, [checked]);

  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Vis eiendommer</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}
