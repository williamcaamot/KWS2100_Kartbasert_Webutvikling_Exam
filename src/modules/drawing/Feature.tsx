import React, { useEffect, useState } from "react";

interface FeatureProps {
  //TODO Proper types her
  feature: any;
  handleDeleteFeature: any;
}

export function Feature({ feature, handleDeleteFeature }: FeatureProps) {
  const [featureText, setFeatureText] = useState<string>(
    feature.getProperties().text,
  );
  const [featureTextColor, setFeatureTextColor] = useState(
    feature.getProperties().textColor,
  );
  const [featureStrokeColor, setFeatureStrokeColor] = useState(
    feature.getProperties().strokeColor,
  );

  useEffect(() => {
    feature.setProperties({
      text: featureText,
      textColor: featureTextColor,
      strokeColor: featureStrokeColor,
    });
  }, [featureText, featureTextColor, featureStrokeColor]);

  return (
    <div className={"py-1"}>
      <div className={"w-full p-2 bg-gray-200 dark:bg-slate-800 rounded"}>
        <div className={"py-1"}>
          Tekst:{" "}
          <input
            className={"dark:bg-slate-600 dark:text-white"}
            type={"text"}
            value={featureText}
            onChange={(e) => setFeatureText(e.target.value)}
          />
        </div>
        <div>
          <div>
            <span className={"font-bold"}>ID:</span> {feature.ol_uid}{" "}
            <span className={"font-bold"}>Type:</span>{" "}
            {feature.getGeometry().getType()}
          </div>
          Text color
          <input
            value={featureTextColor}
            type={"color"}
            onChange={(e) => setFeatureTextColor(e.target.value)}
          />
        </div>
        <div>
          Stroke color
          <input
            value={featureStrokeColor}
            type={"color"}
            onChange={(e) => setFeatureStrokeColor(e.target.value)}
          />
        </div>
        <button
          className={"bg-red-500 text-white p-1 rounded"}
          onClick={() => {
            handleDeleteFeature(feature.ol_uid);
          }}
        >
          Slett
        </button>
      </div>
    </div>
  );
}
