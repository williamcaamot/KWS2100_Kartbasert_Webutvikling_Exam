import React, { useEffect, useState } from "react";
import Switch from "../../../ui/switch";
import {FoodstoreLayer} from "./FoodstoreLayer";
import { useLayer } from "../../map/useLayer";
import useLocalStorageState from "use-local-storage-state";

export function MatbutikkerCheckbox({
  setMatbutikkAsideVisible,
}: {
  setMatbutikkAsideVisible: (value: boolean) => void;
}) {
  const [checked, setMatbutikker] = useLocalStorageState(
    "matbutikk-layer-checked",
    {
      defaultValue: false,
    },
  );

  useLayer(FoodstoreLayer, checked);

  useEffect(() => {
    setMatbutikkAsideVisible(checked);
  }, [checked]);

  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Vis matbutikker</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setMatbutikker} />
    </div>
  );
}
