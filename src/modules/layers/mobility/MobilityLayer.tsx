import request, { gql } from "graphql-request";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  MobilityVehicle,
  MobilityVehiclesResponse,
  mobilityStyle,
} from "./MobilityFeature";
import { Geometry, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import * as ol from "ol";
import { useLayer } from "../../map/useLayer";
import { FeatureLike } from "ol/Feature";
import useLocalStorageState from "use-local-storage-state";
import Switch from "../../../ui/switch";
import { set } from "ol/transform";
import { Spinner } from "@intility/bifrost-react";
import { fromLonLat } from "ol/proj";
import { MapContext } from "../../map/mapContext";

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

function FetchUserLocation() {
  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
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
  const [loading, setLoading] = useState(false);

  const fetchMobility = () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  function handlePointerMove(e: ol.MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
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

  useLayer(mobilityLayer, true);

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
      setLoading(true);
      FetchUserLocation()
        .then((userLocation) => {
          setSelectedCity({
            lat: userLocation.latitude.toString(),
            lon: userLocation.longitude.toString(),
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [selectedCity]);

  useEffect(() => {
    const latitude = parseFloat(selectedCity.lat);
    const longitude = parseFloat(selectedCity.lon);

    if (latitude === 0 && longitude === 0) {
      return;
    }

    map.getView().animate({ center: [longitude, latitude], zoom: 14 });
  }, [selectedCity, map]);

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
        {loading && <Spinner size={25} />}
      </div>
    </div>
  );
};

export default MobilityLayer;
