import React, {useContext} from "react";
import {MapBrowserEvent} from "ol";
import {useLayer} from "../../map/useLayer";
import {MapContext} from "../../map/mapContext";
import {AdresseLayer} from "./AdresseLayer";
import Switch from "../../../ui/switch";
import useLocalStorageState from "use-local-storage-state";

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

    async function handleClick(e: MapBrowserEvent<MouseEvent>) {
        const resolution = map.getView().getResolution();
        if (!resolution || resolution > 1000) {
            return;
        }
        const featuresAtCoordinate =
            AdresseLayer.getSource()?.getClosestFeatureToCoordinate(e.coordinate);

        setActiveFeatureInformation(
            <div>
                <h2 className={"text-xl font-bold"}>Adresser på valgt punkt:</h2>
                <div className={"max-h-96 overflow-y-scroll"}>
                    <ul>
                        {featuresAtCoordinate
                            ?.getProperties()
                            .features.map((feature: any) => (
                                <>
                                    <li
                                        onClick={() => handleFocusAdresse(feature)}
                                        className={"p-2 cursor-pointer hover:bg-gray-200 rounded"}
                                    >
                                        {feature.values_.adressetekst},{" "}
                                        {feature.values_.kommunenummer}{" "}
                                        {feature.values_.kommunenavn}
                                    </li>
                                </>
                            ))}
                    </ul>
                </div>
            </div>,
        );
    }

    useLayer(AdresseLayer, checked);

    return (
        <div className={"flex w-full justify-around p-1"}>
            <p>Vis adresser (from API)</p>
            <div className={"flex-1"}></div>
            <Switch checked={checked} onChange={setChecked}></Switch>
        </div>
    );
}
