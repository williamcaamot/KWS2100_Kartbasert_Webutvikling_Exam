import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../../map/mapContext";
import Switch from "../../../ui/switch";
import { EiendomLayer } from "./EiendomLayer";
import { MapBrowserEvent } from "ol";
import { useLayer } from "../../map/useLayer";
import useLocalStorageState from "use-local-storage-state";

export function EiendomCheckbox() {
    const { map } = useContext(MapContext);
    const [checked, setChecked] = useLocalStorageState("eiendom-layer-checked", {
        defaultValue: false,
    });

    function setActiveFeatureInformation(react: React.JSX.Element) {}

    function handleClick(e: MapBrowserEvent<MouseEvent>) {
        const resolution = map.getView().getResolution();
        if (!resolution || resolution > 1000) {
            return;
        }
        const featuresAtCoordinate =
            EiendomLayer.getSource()?.getClosestFeatureToCoordinate(e.coordinate);
        setActiveFeatureInformation(
            <>
                <div>
                    <h2 className={"font-bold text-xl pb-2"}>
                        Informasjon om valgt teig:
                    </h2>
                    <ul>
                        <li>
                            MatrikkelenhetID:{" "}
                            {featuresAtCoordinate?.getProperties().matrikkelenhetid}
                        </li>
                        <li>
                            kommunenummer:{" "}
                            {featuresAtCoordinate?.getProperties().matrikkel_kommunenummer}
                        </li>
                        <li>
                            Gårdsnummer: {featuresAtCoordinate?.getProperties().gardsnummer}
                        </li>
                        <li>
                            Bruksnummer: {featuresAtCoordinate?.getProperties().bruksnummer}
                        </li>
                        <li>
                            kommunenavn: {featuresAtCoordinate?.getProperties().kommunenavn}
                        </li>
                        <li>
                            Enhetstype:{" "}
                            {featuresAtCoordinate?.getProperties().matrikkelenhetstype}
                        </li>
                    </ul>
                </div>
            </>,
        );
    }

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
