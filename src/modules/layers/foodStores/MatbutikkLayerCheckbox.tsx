import React, { useState } from "react";
import Switch from "../../../ui/switch";
import { MatbutikkerLayer } from "./MatbutikkLayer";
import { useLayer } from "../../map/useLayer";

export function MatbutikkerCheckbox() {
  const [checked, setChecked] = useState(false);

  useLayer(MatbutikkerLayer, checked);
  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Show matbutikker</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}
