import React, {useContext, useEffect, useState} from "react";
import {MapBrowserEvent, Overlay} from "ol";
import {useLayer} from "../../map/useLayer";
import {MapContext} from "../../map/mapContext";
import {AdresseFeature, AdresseLayer, AdresseProperties, adresseStyle, hoverAdresseStyle} from "./AdresseLayer";
import Switch from "../../../ui/switch";
import useLocalStorageState from "use-local-storage-state";
import {mobilityActiveStyle, mobilityStyle} from "../mobility/MobilityFeature";

export function AdresseLayerCheckbox() {
    const [checked, setChecked] = useLocalStorageState("adresse-layer-checked", {
        defaultValue: false,
    });

    const {map} = useContext(MapContext);

    function handleFocusAdresse(adresse: any) {
        // Want to maybe select a teig here? And get all teig details?
        map.getView().animate({
            center: [
                adresse.values_.geometry.flatCoordinates[0],
                adresse.values_.geometry.flatCoordinates[1],
            ],
            zoom: 20,
        });
    }

    function setActiveFeatureInformation(react: React.JSX.Element) {
    }

    function handleClick(e: MapBrowserEvent<MouseEvent>) {
        const resolution = map.getView().getResolution();
        if (!resolution || resolution > 1000) {
            return;
        }


        var featuresAtCoordiante = map.forEachFeatureAtPixel(e.pixel, function (feature) {
                return feature as AdresseFeature
            },
        )
        const coordinate = e.coordinate;
        popup.setPosition(coordinate);
        //console.log(`amount of features: ${featuresAtCoordiante?.getProperties().features.length}`)
        if (featuresAtCoordiante?.getProperties().features.length === 1) {
            //console.log("Adding single feature")
            const singleFeature = featuresAtCoordiante?.getProperties().features[0] as AdresseFeature;
            const singleFeatureProperties = singleFeature.getProperties() as AdresseProperties;
            popupElement.innerHTML = `
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
            `;
            popupElement.style.display = "block";
        }else if(featuresAtCoordiante?.getProperties().features.length > 1){
            const coordinates = featuresAtCoordiante?.getProperties().geometry.flatCoordinates;
            if(map?.getView()?.getZoom() !== undefined){
                const currentZoom = map.getView().getZoom();
                const view = map.getView();
                if (currentZoom !== undefined && view) {
                    view.animate({
                        zoom: currentZoom + 1,
                        duration: 300,
                        center: [coordinates[0], coordinates[1]]
                    });
                }
            }

            return
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

    let selected:AdresseFeature;

    const [activeFeature, setActiveFeature] = useState()

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

    useLayer(AdresseLayer, checked);

    return (
        <div className={"flex w-full justify-around p-1"}>
            <p>Vis adresser</p>
            <div className={"flex-1"}></div>
            <Switch checked={checked} onChange={setChecked}></Switch>
        </div>
    );
}
