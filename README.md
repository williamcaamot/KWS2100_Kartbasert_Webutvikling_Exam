[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/y-IGFidy)

# KWS2100 Exam - Mapzter

### Deployment

[![publish](https://github.com/kristiania-kws2100-2024/kws2100-exam-williamcaamot/actions/workflows/publish.yaml/badge.svg)](https://github.com/kristiania-kws2100-2024/kws2100-exam-williamcaamot/actions)

URL: https://kristiania-kws2100-2024.github.io/kws2100-exam-williamcaamot/

## About this application

This application is designed to explore neighbourhoods and local offerings. It can be used to explore where you live, where you want to go, or where you want to live. The application provides information about transportation (trains & scooters), addresses, properties and food stores (++). See the feature descriptions below for more information.

# Features for grades

#### See the description for each feature requirement.

### E:

- [x] If you deploy a React application that displays a map with OpenLayers on GitHub pages, you will pass. If you fail to deploy correctly, but your code indicates that you could have achieved a C, you will also pass

### D:

- [x] Your map must contain some vector data and some interaction

### C:

- [x] The interactions, data sources or styling is beyond what was expected for the assignment. You need to display data sources that was not used in the lectures or assignment with at least two types of geometries (point, linestring, polygon)

### B:

- [x] You can display both polygon and point geometries from at least 4 data sources
- [x] Your code is structured to make it easy to find the code corresponding to each data source and in order to make it easy to add more features
- **COMMENT:** We have done our best with the time available to create a clean and structured project though consistancy, good naming and clean functions.
- [x] You can click on a feature to display an Overlay with properties of the features
- [x] You display an Overview map
- **COMMENT:** Overview map must be expanded in the bottom left corner. The overlay map will also change when baselayer maps are changed.

### A:

- [x] Display moving data on a map using a GraphQL data source. You can use Entur's GraphQL vehicle data (not protobuf) or find a GraphQL websocket dataset on your own
  - **COMMENT:** Trains(tog) are live data though a GraphQL subscription data source. Scooters (mobility) are also from GraphQL data source, but they are not live.
- [x] Display a Clustered vector data source with OpenLayers. The style of a cluster of features should reflect the size of the cluster. Display a single-feature cluster with a separate style using icons that vary based on a property of the feature. NOTE: The usefulness and design ofyour styles will affect your grade
- - **COMMENT:** Adresser is displayed as a clustered feature. Single features in kommuner of Asker, Oslo and Bærum have different styling as per the requirement.
- [x] Deploy your own GIS API to a hosted service and display a huge dataset from a PostGlS database to a map, limited to the extent displayed to the user. You can use Express on https://heroku.com or pick your own backend technology for the server (you get free credits for Heroku with GitHub Student Pack). You must check in the code for the server to the repository
- - **COMMENT:** 3 different layers are fetched through our API. Adresser, eiendommer/teig and matbutikker requires a certain zoom level to display.
- [x] Combine several Tile Layers by using Layer opacity and let the user choose and combine layers. At least one of the background layers should be a vector tile layer. The background layers should be in more than one geographic projection
- - **COMMENT:** Arctic layer changes projection. User can select layer opacity on the overlay layer.
- [x] Create a fully styled vector tiled background map using Mapzen. You can use the OpenLayers Mapzen example at https://openlayers.org/en/latest/examples/osmvector-tiles.html as inspiration. You must style at least 5 different types of features (object collection or kind) and you must incorporate texts into the styling. For double points, incorporate pointer interaction, e.g. display bus routes when hovering over them
  - **COMMENT:** We had difficulties finding maps here. We have two different tile layers that can be styled (MapTiler Streets & ogcVectorTile). The style for OGC is saved to localstorage.
- [x] Let the user draw and modify features with at least two types of geometries, including circles with a radius in meters. Store the features in localStorage so that when the user refreshes, the features remain on the map. The user should be able to modify the geometry of the feature and properties that should be reflected in the style of the feature
  - **COMMENT:** Saving circles does not work. "Lagre" button must be pressed to persist the features in localstorage.
- [x] Interaction between data in a sidebar and the view on the map: Show a sidebar with a list of a type of feature displayed on the map, filtered to the visible features. When clicking on a feature on the sidebar, the map should zoom to feature. Since there's only one feature visible, the sidebar can be hidden - but it should be easy to zoom back to the previous view. To "go back", store in sessionStorage the view center and zoom before zooming to a feature.

  - **COMMENT:** Matbutikker has a sidebar with the matbutikker that is in the extent. You can click a store in the sidebar to be taken closer to the store, and return with the button that appears over the list of stores.

- We onclick overlays for the following features: Mobility(Scooters), trains, adresses (only for single features, clicking cluster zooms to it.) and eiendommer.

## Extra features

- [x] Search for address and click on address to go to it
- [x] Settings section for enabling & disabling overview map, scaleline & zoomslider. Works with localstorage.
- [x] Most settings are stored in LS. All Data layers, OGC VectorTileLayer, Drawings(except Circles) and user settings.
- [x] Refresh button to reset selected layers
- [x] Darkmode & lightmode (from system settings)
  - [x] Possible to toggle dark/light mode from settings too
- [x] Shift+create selection on map => zoom to that selection
- [x] Mobile- and user-friendly design
- [x] All Vectorlayers and backgroundlayers have pre-loading set to infinity for a smooth experience.
- [x] Stadia-maps are activated with a API-key

### Data sources

- Adresser (https://kartkatalog.geonorge.no/metadata/matrikkelen-adresse/f7df7a18-b30f-4745-bd64-d0863812350c?search=adresser)
- Eiendommer / teig (https://kartkatalog.geonorge.no/metadata/matrikkelen-eiendomskart-teig/74340c24-1c8a-4454-b813-bfe498e80f16?search=eiendommer)
- Forsvaret støy (https://kartkatalog.geonorge.no/metadata/stoeysoner-for-tunge-vaapen-i-forsvarets-skyte--og-vingsfelt/f59e922b-a2b1-4f1a-a13e-efe72bfe7378)
- Matbutikker (Inserted data from API into postgis database: https://kassal.app/api)
- Kommuner: https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/
- Adresse søk via Kartverket API (https://ws.geonorge.no/adresser/v1/)
- Populasjon: https://kart.ssb.no/
- Jernbanelinjer: https://kart.dsb.no/ > Jernbanelinjer N50

### Background layers with sources:

- Open Street Map: https://www.openstreetmap.org/#map=5/65.401/17.864
- Stadia Map light: https://stadiamaps.com/
- Stadia Map Dark: https://stadiamaps.com/
- Kartverket: https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS
- Flyfoto: https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities
- Satellite/global flyfoto/XYZ map: https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
- Arctic: https://geoportal.arctic-sdi.org/
- MapTiler Streets: https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=TnrB96NpsTO149dXrCgI
- OGCVectorTile: https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:cultural:ne_10m_admin_0_countries/tiles/WebMercatorQuad

## Other information

- Since everyone on the group already was familiar with Tailwind CSS we used this because we think it improves our development speed. We also choose to combine styles with regular CSS as well.
- We have committed an equal amount of code and all participated equally, in some cases we have worked together on one computer, for example the initial commit.

## Known bugs:

- When selecting address layer, then eiendom layer, only overlay information on eiendom layer works.
- Due to low intervalls from Entur, the trains with an updated location update every 5-10 seconds. Easier to see if zoomed out a bit, than you can see the trains that receive updates, move .
- Saving circles to localstorage doesn't work due to the geometric object type.
- Checkbox for darkmode doesn't follow system theme on page load, however it works fine to toggle modes after initial lode.
