import React, { useState } from "react";
import {kommuneLayer} from "./KommuneLayer";
import Switch from "../../../ui/switch";
import {useLayer} from "../../map/useLayer";
import useLocalStorageState from "use-local-storage-state";

export function KommuneLayerCheckbox() {
    const [checked, setKommuner] = useLocalStorageState("kommuner-layer-checked", {
        defaultValue: false,
    });

    useLayer(kommuneLayer, checked)

    return (
        <div className={"flex w-full justify-around p-1"}>
            <p>Show kommuner</p>
            <div className={"flex-1"}></div>
            <Switch checked={checked} onChange={setKommuner}/>
        </div>
    );
}