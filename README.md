[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/y-IGFidy)

# KWS2100 Exam - Mapzter

### Deployment

[![publish](https://github.com/kristiania-kws2100-2024/kws2100-exam-williamcaamot/actions/workflows/publish.yaml/badge.svg)](https://github.com/kristiania-kws2100-2024/kws2100-exam-williamcaamot/actions)

URL: https://kristiania-kws2100-2024.github.io/kws2100-exam-williamcaamot/

## About this application

This application is designed to explore neighbourhoods and local offerings. It can be used to explore where you live, where you want to go, or where you want to live. The application provides information about transportation (trains & scooters), addresses, properties and food stores. As well as kommuner

# Features for grades
### E:
- [X] If you deploy a React application that displays a map with OpenLayers on GitHub pages, you will pass. If you fail to deploy correctly, but your code indicates that you could have achieved a C, you will also pass
### D:
- [X] Your map must contain some vector data and some interaction
### C:
- [X] The interactions, data sources or styling is beyond what was expected for the assignment. You need to display data sources that was not used in the lectures or assignment with at least two types of geometries (point, linestring, polygon)
### B:
- [X] You can display both polygon and point geometries from at least 4 data sources 
- [X] Your code is structured to make it easy to find the code corresponding to each data source and in order to make it easy to add more features
- [X] You can click on a feature to display an Overlay with properties of the features 
- [X] You display an Overview map 
### A:
- [X] Display moving data on a map using a GraphQL data source. You can use Entur's GraphQL vehicle data (not protobuf) or find a GraphQL websocket dataset on your own
- [X] Display a Clustered vector data source with OpenLayers. The style of a cluster of features should reflect the size of the cluster. Display a single-feature cluster with a separate style using icons that vary based on a property of the feature. NOTE: The usefulness and design ofyour styles will affect your grade
- - **COMMENT:** Adresser is displayed as a clustered feature. Single features in kommuner of Asker, Oslo and Bærum have different styling as per the requirement.
- [X] Deploy your own GIS API to a hosted service and display a huge dataset from a PostGlS database to a map, limited to the extent displayed to the user. You can use Express on https://heroku.com or pick your own backend technology for the server (you get free credits for Heroku with GitHub Student Pack). You must check in the code for the server to the repository
- **COMMENT:** 3 different layers. Addresser and teig/eiendommer are huge datasets (only displays when zoomed in enough). Matbutikker is also fetched through our API.
- [X] Combine several Tile Layers by using Layer opacity and let the user choose and combine layers. At least one of the background layers should be a vector tile layer. The background layers should be in more than one geographic projection
- - **COMMENT:** Arctic layer changes projection. User can select layer opacity on the overlay layer.
- [X] Create a fully styled vector tiled background map using Mapzen. You can use the OpenLayers Mapzen example at https://openlayers.org/en/latest/examples/osmvector-tiles.html as inspiration. You must style at least 5 different types of features (object collection or kind) and you must incorporate texts into the styling. For double points, incorporate pointer interaction, e.g. display bus routes when hovering over them
  - **COMMENT:** We had difficulties finding maps here. We have two different tile layers that can be styled (MapTiler Streets & ogcVectorTile). The style is saved to localstorage.
- [X] Let the user draw and modify features with at least two types of geometries, including circles with a radius in meters. Store the features in localStorage so that when the user refreshes, the features remain on the map. The user should be able to modify the geometry of the feature and properties that should be reflected in the style of the feature
  - **COMMENT:** Saving circles does not work. "Lagre" button must be pressed to persist the features in localstorage. 
- [X] Interaction between data in a sidebar and the view on the map: Show a sidebar with a list of a type of feature displayed on the map, filtered to the visible features. When clicking on a feature on the sidebar, the map should zoom to feature. Since there's only one feature visible, the sidebar can be hidden - but it should be easy to zoom back to the previous view. To "go back", store in sessionStorage the view center and zoom before zooming to a feature.

## Extra features
- [X] Search for address and click on address to go to it
- [X] Settings section for enabling & disabling overview map, scaleline & zoomslider. Works with localstorage.
- [X] Layer selection is saved in localstorage on refresh.
- [X] Refresh button to reset selected layers
- [X] Darkmode & lightmode (from system settings)
- [X] Shift+create selection on map => zoom to that selection

## To-do (try have high priority at top of list)

- [ ] Fix bug for circles not saving to localstorage
- [x] Add color selection for drawing
- [ ] Add interaction (onclick) on the map for different features
- - [ ] Generic overlay component to display information when clicking
- [ ] Vector tile layer with styling
- - [x] OGCVector layer (VERY basic Vector tyle with styling saved to localstorage)
- [x] Polar layer with correct projection
- [x] Fix reset button in navigation
- [x] Make matbutikklayer images scale better when zooming in close
- [x] Loading icon for between API fetch and result is applied to map (loading spinner)
- [x] Add custom zoom component
- [ ] Style improvmenet for mobility & train
- [x] Overview map with controls in settings https://openlayers.org/en/latest/examples/overviewmap.html
- [x] Settings for zoom slider, scale line

### Data features with sources:

- Adresse søk via Kartverket API (https://ws.geonorge.no/adresser/v1/)
- Adresser with clustering (https://kartkatalog.geonorge.no/metadata/matrikkelen-adresse/f7df7a18-b30f-4745-bd64-d0863812350c?search=adresser)
- Eiendommer / teig (https://kartkatalog.geonorge.no/metadata/matrikkelen-eiendomskart-teig/74340c24-1c8a-4454-b813-bfe498e80f16?search=eiendommer)
- Forsvaret støy (https://kartkatalog.geonorge.no/metadata/stoeysoner-for-tunge-vaapen-i-forsvarets-skyte--og-vingsfelt/f59e922b-a2b1-4f1a-a13e-efe72bfe7378)
- Matbutikker (Inserted data from API into postgis database: https://kassal.app/api)

### Background layers with sources:

- LIST ALL BACKGROUND LAYERS WITH SOURCES HERE

## Other information

- Since everyone on the group already was familiar with Tailwind CSS and prefer this over normal CSS we decided to use this because we work faster with it.
