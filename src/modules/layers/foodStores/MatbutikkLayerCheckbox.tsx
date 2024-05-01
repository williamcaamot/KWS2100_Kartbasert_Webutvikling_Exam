import React, { useEffect, useState } from "react";
import Switch from "../../../ui/switch";
import { FoodstoreLayer } from "./FoodstoreLayer";
import { useLayer } from "../../map/useLayer";
import useLocalStorageState from "use-local-storage-state";

export function MatbutikkerCheckbox({
  setMatbutikkAsideVisible,
}: {
  setMatbutikkAsideVisible: (value: boolean) => void;
}) {
  const [checked, setChecked] = useLocalStorageState(
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
    <div className="flex w-full justify-around p-1 flex-col">
      <div className={"flex w-full justify-around"}>
        <p>Vis matbutikker</p>
        <div className={"flex-1"}></div>
        <Switch checked={checked} onChange={setChecked} />
      </div>
      <p className="text-yellow-500">
        {checked ? "(Obs! Krever zoom)" : undefined}
      </p>
    </div>
  );
}
