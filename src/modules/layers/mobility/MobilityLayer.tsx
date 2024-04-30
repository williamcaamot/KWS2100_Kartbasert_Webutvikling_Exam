import request, { gql } from "graphql-request";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  MobilityVehicle,
  MobilityVehiclesFeature,
  MobilityVehiclesResponse,
  mobilityActiveStyle,
  mobilityStyle,
} from "./MobilityFeature";
import { Geometry, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature, Overlay } from "ol";
import * as ol from "ol";
import { useLayer } from "../../map/useLayer";
import { FeatureLike } from "ol/Feature";
import useLocalStorageState from "use-local-storage-state";
import Switch from "../../../ui/switch";
import { MapContext } from "../../map/mapContext";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

const MOBILITY_QUERY = gql`
  query MobilityQuery(
    $lat: Float!
    $lon: Float!
    $range: Int!
    $count: Int!
    $formFactors: [FormFactor]!
  ) {
    vehicles(
      lat: $lat
      lon: $lon
      range: $range
      count: $count
      formFactors: $formFactors
    ) {
      id
      lat
      lon
      pricingPlan {
        description {
          translation {
            language
            value
          }
        }
      }
      system {
        name {
          translation {
            language
            value
          }
        }
      }
      isReserved
      isDisabled
      currentRangeMeters
    }
  }
`;

// Function to create a feature from a vehicle
function createFeatureFromMobilityVehicle(
  vehicle: MobilityVehicle,
): ol.Feature {
  const feature = new ol.Feature({
    geometry: new Point([vehicle.lon, vehicle.lat]),
  });
  feature.setId(vehicle.id);
  feature.setProperties(vehicle);
  return feature;
}

const mobilityLayer = new VectorLayer({
  source: new VectorSource(),
  className: "mobility",
  style: mobilityStyle,
});

const mobilityCitiesOptions = [
  { value: { lat: "59.9139", lon: "10.7522" }, label: "Oslo" },
  { value: { lat: "60.3913", lon: "5.3221" }, label: "Bergen" },
  { value: { lat: "63.4305", lon: "10.3951" }, label: "Trondheim" },
  { value: { lat: "58.9700", lon: "5.7331" }, label: "Stavanger" },
  { value: { lat: "58.1599", lon: "8.0182" }, label: "Kristiansand" },
  { value: { lat: "0", lon: "0" }, label: "My location" },
];

function FetchUserLocation(map: ol.Map) {
  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            // Create a point geometry at your location
            const point = new Point([
              position.coords.longitude,
              position.coords.latitude,
            ]);

            // Create a feature with the point geometry
            const feature = new Feature(point);

            // Create a style for the feature
            const style = new Style({
              image: new Circle({
                radius: 14,
                fill: new Fill({ color: "rgba(0, 0, 230, 0.7)" }),
                stroke: new Stroke({
                  color: "white",
                  width: 4,
                }),
              }),
              text: new Text({
                text: "Your Position",
                offsetY: -30,
                fill: new Fill({ color: "black" }),
                stroke: new Stroke({ color: "white", width: 5 }),
              }),
            });

            // Set the style of the feature
            feature.setStyle(style);

            // Create a vector source and add the feature to it
            const source = new VectorSource({
              features: [feature],
            });

            // Create a vector layer with the vector source
            const layer = new VectorLayer({
              source: source,
            });

            // Add the layer to the map
            map.addLayer(layer);
          },
          (error) => {
            reject(error);
          },
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    },
  );
}

const MobilityLayer = () => {
  const { map } = useContext(MapContext);
  const [activeFeature, setActiveFeature] = useState<MobilityVehicle>();
  const [checked, setChecked] = useLocalStorageState("mobility-layer-checked", {
    defaultValue: false,
  });
  const [selectedCity, setSelectedCity] = useState<{
    lat: string;
    lon: string;
  }>({ lat: "59.9139", lon: "10.7522" });

  const [selectedFeature, setSelectedFeature] = useState<MobilityVehiclesFeature>();

  const fetchMobility = () => {
    request<MobilityVehiclesResponse>(
      "https://api.entur.io/mobility/v2/graphql",
      MOBILITY_QUERY,
      {
        lat: parseFloat(selectedCity.lat),
        lon: parseFloat(selectedCity.lon),
        range: 300,
        count: 100000,
        formFactors: ["SCOOTER"],
      },
    )
      .then((data) => {
        const { vehicles } = data as { vehicles: MobilityVehicle[] };
        const features: ol.Feature[] = vehicles.map(
          createFeatureFromMobilityVehicle,
        );

        if (mobilityLayer) {
          const source = mobilityLayer.getSource();
          if (source) {
            // Clear existing features
            source.clear();

            // Add new features
            features.forEach((feature: Feature<Geometry>) => {
              source.addFeature(feature);
            });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function handlePointerMove(e: ol.MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 6) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === mobilityLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as unknown as MobilityVehicle);
    } else {
      setActiveFeature(undefined);
    }
  }

  const overlayContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = new Overlay({
      element: overlayContainerRef.current!,
      autoPan: true,
    });
    map.addOverlay(overlay);
  }, [map]);

  function handleSingleClick(e: ol.MapBrowserEvent<MouseEvent>) {
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === mobilityLayer,
    });
    if (features.length === 1) {
      const feature = features[0] as ol.Feature;
      // Update the content of the overlay
      if (overlayContainerRef.current) {
        overlayContainerRef.current.innerHTML = JSON.stringify(
          feature.getProperties(),
        );
      }
      // Set the position of the overlay to the coordinate of the clicked feature
      map.getOverlays().item(0).setPosition(e.coordinate);
    }
  }

  useEffect(() => {
    if (checked) {
      map?.on("singleclick", handleSingleClick);
    }
    return () => map?.un("singleclick", handleSingleClick);
  }, [checked]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  useEffect(() => {
    if (checked) {
      fetchMobility();
    } else {
      if (mobilityLayer) {
        const source = mobilityLayer.getSource();
        if (source) {
          source.clear();
        }
      }
    }
  }, [checked, selectedCity]);

  useEffect(() => {
    if (selectedCity.lat === "0" && selectedCity.lon === "0") {
      FetchUserLocation(map)
        .then((userLocation) => {
          setSelectedCity({
            lat: userLocation.latitude.toString(),
            lon: userLocation.longitude.toString(),
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedCity]);

  useEffect(() => {
    const latitude = parseFloat(selectedCity.lat);
    const longitude = parseFloat(selectedCity.lon);

    if (latitude === 0 && longitude === 0) {
      return;
    }

    map.getView().animate({ center: [longitude, latitude], zoom: 17 });
  }, [selectedCity, map]);

  useEffect(() => {
    if (activeFeature) {
      activeFeature.setStyle(mobilityActiveStyle);
    }
    return () => {
      if (activeFeature) {
        activeFeature.setStyle(mobilityStyle);
      }
    };
  }, [activeFeature]);


// Popup showing the position the user clicked
const popupElement = document.createElement('div');
popupElement.style.backgroundColor = 'white';
popupElement.style.padding = '10px';
popupElement.style.borderRadius = '5px';
popupElement.style.border = '1px solid black';
popupElement.style.display = 'none';
document.body.appendChild(popupElement);

const popup = new Overlay({
  element: popupElement,
});
map.addOverlay(popup);

map.on("click", function (evt) {
    const resolution = map.getView().getResolution();
    if (!checked || !resolution || resolution > 100) {
      return;
    }
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature as MobilityVehiclesFeature;
    });

    if (feature?.getProperties().id) {
        setSelectedFeature(feature);
        // Show the popup here
        const coordinate = evt.coordinate;
        popup.setPosition(coordinate);
        const currentRangeKm = feature.getProperties().currentRangeMeters / 1000;
        popupElement.innerHTML = `
          <span>
            <h2>${feature.getProperties().system.name.translation[0].value}</h2>
            <p>Status: ${feature.getProperties().isDisabled ? "Disabled" : "Not disabled"}</p>
            <p>Availability: ${feature.getProperties().isReserved ? "Reserved" : "Available"}</p>
            <p>Pricing Plan: ${feature.getProperties().pricingPlan.description.translation[0].value}</p>
            <p>Current Range (Kilometers): ${currentRangeKm}</p>
          </span>
        `;
        popupElement.style.display = 'block';
      }
  });
  
  map.on('pointermove', function () {
    popupElement.style.display = 'none';
  });
  useLayer(mobilityLayer, true);

  return (
    <div className={"flex w-full justify-around p-1 flex-col"}>
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <p>Hent mobility</p>
        <div className={"flex-1"}></div>
        <Switch checked={checked} onChange={setChecked} />
      </div>
      <div
        ref={overlayContainerRef}
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: "10px",
          maxWidth: "200px",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {checked && (
          <form className="max-w-sm">
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setSelectedCity(JSON.parse(e.currentTarget.value))
              }
              defaultValue="none"
            >
              <option value="none">Choose a country</option>
              {mobilityCitiesOptions.map((option) => (
                <option
                  key={option.value.lat + option.value.lon}
                  value={JSON.stringify(option.value)}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </form>
        )}
      </div>
    </div>
  );
};

export default MobilityLayer;
