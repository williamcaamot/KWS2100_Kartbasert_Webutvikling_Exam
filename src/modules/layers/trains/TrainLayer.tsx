import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { request } from "graphql-request";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import * as ol from "ol";
import { FeatureLike } from "ol/Feature";
import { MapBrowserEvent } from "ol";
import {
  TrainFeature,
  TrainProperties,
  activeTrainStyle,
  trainStyle,
} from "./TrainFeature";
import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { useSubscription } from "@apollo/client";
import { Subscription } from "zen-observable-ts";
import { Geometry } from "ol/geom";
import { MapContext } from "../../map/mapContext";
import { useLayer } from "../../map/useLayer";
import Switch from "../../../ui/switch";
import useLocalStorageState from "use-local-storage-state";

// Create an http link:
const httpLink = new HttpLink({
  uri: "https://api.entur.io/realtime/v1/vehicles/graphql",
});

// Create a WebSocket link:
const wsLink = new WebSocketLink(
  new SubscriptionClient(
    "wss://api.entur.io/realtime/v1/vehicles/subscriptions",
    {
      reconnect: true,
    },
  ),
);

// Using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({
  typePolicies: {
    Subscription: {
      fields: {
        vehicles: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

// Instantiate client
export const client = new ApolloClient({
  link: splitLink,
  cache: cache,
});

// Define your subscription
const VEHICLES_QUERY = gql`
  query Vehicles($codespaceId: String!) {
    vehicles(codespaceId: $codespaceId) {
      line {
        lineRef
      }
      lastUpdated
      vehicleId
      location {
        latitude
        longitude
      }
      vehicleStatus
      delay
      speed
      bearing
    }
  }
`;

const VEHICLES_SUBSCRIPTION = gql`
  subscription Vehicles($codespaceId: String!) {
    vehicles(codespaceId: $codespaceId) {
      line {
        lineRef
      }
      lastUpdated
      vehicleId
      location {
        latitude
        longitude
      }
      vehicleStatus
      delay
      speed
      bearing
    }
  }
`;

type VehiclesData = {
  vehicles: TrainProperties[];
};

const trainLayer = new VectorLayer({
  source: new VectorSource(),
  className: "trains",
  style: trainStyle,
});

// Function to create a feature from a vehicle
function createFeatureFromVehicle(vehicle: TrainProperties): ol.Feature {
  const feature = new ol.Feature({
    geometry: new Point([
      vehicle.location.longitude,
      vehicle.location.latitude,
    ]),
  });
  feature.setId(vehicle.vehicleId);
  feature.setProperties(vehicle);
  return feature;
}

export function TrainLayer() {
  const { map } = useContext(MapContext);

  const [checked, setChecked] = useLocalStorageState("train-layer-checked", {
    defaultValue: false,
  });
  const [activeFeature, setActiveFeature] = useState<TrainFeature>();
  const [codespaceId, setCodespaceId] = useState<string>("NSB"); // Add type assertion
  const validCodespaceId = codespaceId ?? "NSB";

  // Use the useSubscription hook to subscribe to the train updates
  const { data, error } = useSubscription<VehiclesData>(VEHICLES_SUBSCRIPTION, {
    variables: { codespaceId: validCodespaceId },
    skip: !checked,
  });

  const fetchTrains = (codespaceId?: string) => {
    request<VehiclesData>(
      "https://api.entur.io/realtime/v1/vehicles/graphql",
      VEHICLES_QUERY,
      { codespaceId: codespaceId ?? validCodespaceId },
    )
      .then((data) => {
        const { vehicles } = data as { vehicles: TrainProperties[] };
        const features: ol.Feature[] = vehicles.map(createFeatureFromVehicle);

        if (trainLayer) {
          const source = trainLayer.getSource();
          if (source) {
            features.forEach((feature: Feature<Geometry>) => {
              const id = feature.getId() as string | number; // Add type assertion
              const existingFeature = source.getFeatureById(
                id,
              ) as Feature<Geometry>;
              if (existingFeature) {
                existingFeature.setGeometry(feature.getGeometry()); // Update the geometry
                existingFeature.setProperties(feature.getProperties()); // Update the properties
              } else {
                source.addFeature(feature);
              }
            });
          }
        }
      })
      .catch((error) => console.error(error));
  };

  // Handle the updates
  useEffect(() => {
    if (data && data.vehicles) {
      const source = trainLayer.getSource();
      if (source) {
        data.vehicles.forEach((vehicle: TrainProperties) => {
          let feature = source.getFeatureById(vehicle.vehicleId);
          if (feature) {
            // Update the existing feature
            feature.setGeometry(
              new Point([
                vehicle.location.longitude,
                vehicle.location.latitude,
              ]),
            );
            feature.setProperties(vehicle);
          } else {
            // Add a new feature
            feature = createFeatureFromVehicle(vehicle);
            source.addFeature(feature);
          }
        });
      }
    }

    if (error) {
      console.error("Subscription error:", error);
    }
  }, [data, error]);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === trainLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as TrainFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    if (activeFeature) {
      activeFeature.setStyle(activeTrainStyle);
    }
    return () => {
      if (activeFeature) {
        activeFeature.setStyle(trainStyle);
      }
    };
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  useEffect(() => {
    if (checked) {
      fetchTrains();
      map?.addLayer(trainLayer);
    } else {
      trainLayer?.getSource()?.clear();
      map?.removeLayer(trainLayer);
    }
  }, [checked, map]);

  useEffect(() => {
    if (checked) {
      // Clear the previous trains
      const source = trainLayer.getSource();
      if (source) {
        source.clear();
      }

      // Fetch the new trains
      fetchTrains(codespaceId);
    }
  }, [checked, codespaceId]);

  useLayer(trainLayer, checked);

  return (
    <div className={"flex w-full justify-around p-1"}>
      <p>Vis tog (subscription)</p>
      <div className={"flex-1"}></div>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}

export default TrainLayer;