[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/y-IGFidy)

# KWS2100 Exam - Mapzter

### Deployment

[![publish](https://github.com/kristiania-kws2100-2024/kws2100-exam-williamcaamot/actions/workflows/publish.yaml/badge.svg)](https://github.com/kristiania-kws2100-2024/kws2100-exam-williamcaamot/actions)

URL: https://kristiania-kws2100-2024.github.io/kws2100-exam-williamcaamot/

## About this application

This application is designed to explore neighbourhoods and local offerings. It can be used to explore where you live, where you want to go, or where you want to live.

## To-do (try have high priority at top of list)

- [x] Tegning med lagring til localstorage
- [ ] Fix bug for circles not saving to localstorage
- [x] Add color selection for drawing
- [ ] Add interaction (onclick) on the map for different features
- - [ ] Generic overlay component to display information when clicking
- [ ] Vector tile layer with styling
- - [x] OGCVector layer (VERY basic Vector tyle with styling saved to localstorage)
- [x] Polar layer with correct projection
- [x] Fix reset button in navigation
- [ ] Make matbutikklayer images scale better when zooming in close
- [x] Loading icon for between API fetch and result is applied to map (loading spinner)
- [x] Add custom zoom component
- [ ] Style improvmenet for mobility & train
- [x] Overview map with controls in settings https://openlayers.org/en/latest/examples/overviewmap.html
- [x] Settings for zoom slider, scale line

## Application Features

#### Adresser with clustering:

- Cluster color and size is based of the amount of addresses inside of it.
- Single point addresses inside kommuner of Oslo, Asker and Bærum has different colors, as per the requirement to have "single-feature cluster with a seperatre style using icons that vary based on a property of the feature."

### Data features with sources:

- Adresse søk via Kartverket API (https://ws.geonorge.no/adresser/v1/)
- Adresser with clustering (https://kartkatalog.geonorge.no/metadata/matrikkelen-adresse/f7df7a18-b30f-4745-bd64-d0863812350c?search=adresser)
- Eiendommer / teig (https://kartkatalog.geonorge.no/metadata/matrikkelen-eiendomskart-teig/74340c24-1c8a-4454-b813-bfe498e80f16?search=eiendommer)
- Forsvaret støy (https://kartkatalog.geonorge.no/metadata/stoeysoner-for-tunge-vaapen-i-forsvarets-skyte--og-vingsfelt/f59e922b-a2b1-4f1a-a13e-efe72bfe7378)
- Matbutikker (Inserted data from API into postgis database: https://kassal.app/api)

### Background layers with sources:

- LIST ALL BACKGROUND LAYERS WITH SOURCES HERE

### Other features

- Shift + make selection on map => zoom to that selection

## Other information

- Since everyone on the group already was familiar with Tailwind CSS and prefer this over normal CSS we decided to use this because we work faster with it.

## Features for A:

- [x] Display moving data on a map using GraphQL data source.
- [x] Display a clustered vector data source with open layers. Both size and color of the cluster is based on the size of it. This is adresse layer.
- [x] Deploy your own GIS API to a hosted service and display a huge dataset from PostGIS database to a map. This is hosted on Heroku. Displaying both teig(eiendommer) & addresses, as well as foodstores in Norway.
