import { Box, Flex, Button, position } from '@chakra-ui/react'

import {
  minMapZoom,
  bayesianMapOptions,
  overviewMapOptions,
  heatmapMapOptions,
  selectionToInfoBoxBGMapping,
  amountSliderSteps,
  heatMapColorGradient,
  api_host,
  locations,
  metersPerSliderStep,
} from '../utils/constants'

import InfoCard from './InfoCard'
import InfoBoxBayesian from './InfoBoxBayesian'

import React from 'react'
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayer,
  Polyline,
  MarkerF,
  LoadScriptProps,
  InfoBox,
} from '@react-google-maps/api'

import { useRef } from 'react'

const getRecenterDirection = (locationKey, condition, zoomLevel) => {
  switch (condition) {
    case 'bayesian':
      switch (zoomLevel) {
        case 14:
          return 'down'
        case 12:
          switch (locationKey) {
            case '0':
              return condition == 'bayesian' ? 'top-left' : 'right'
            case '3':
              return condition == 'bayesian' ? 'right' : 'right'
            case '1':
            case '2':
            case '4':
              return condition == 'bayesian' ? 'down-right' : 'right'
          }
        case 13:
          switch (locationKey) {
            case '0':
              return condition == 'bayesian' ? 'left' : 'right'
            case '3':
              return condition == 'bayesian' ? 'right' : 'right'
            case '1':
            case '2':
            case '4':
              // console.log('down right')
              return condition == 'bayesian' ? 'down-right' : 'right'
          }
      }
  }
  // // console.log('recenter', locationKey)
  // switch (locationKey) {
  //   case '0':
  //     switch (zoomLevel) {
  //       case 13:
  //         return condition == 'bayesian' ? 'up' : 'left'
  //     }
  //   case '1':
  //     switch (zoomLevel) {
  //       case 13:
  //         return condition == 'bayesian' ? 'up' : 'up-left'
  //     }
  //   case '2':
  //     switch (zoomLevel) {
  //       case 13:
  //         return condition == 'bayesian' ? 'up' : 'left'
  //     }
  //   case '3':
  //     switch (zoomLevel) {
  //       case 13:
  //         return condition == 'bayesian' ? 'up' : 'up-right'
  //     }
  //   case '4':
  //     switch (zoomLevel) {
  //       case 13:
  //         return condition == 'bayesian' ? 'up' : 'right'
  //     }

  //   default:
  //     return 'right'
  // }
}

const recenterMapObject = (position, side, type, zoomLevel = 13) => {
  // // console.log('recenter map obj')
  // // console.log('position', position)
  // // console.log('side', side)
  // // console.log('type', type)
  let recenterDistance
  let angle

  // console.log(zoomLevel)

  switch (type) {
    case 'infobox':
      switch (side) {
        case 'left':
          recenterDistance = 330 + 5000
          angle = 175
          break
        case 'up-left':
          recenterDistance = 330 + 5000
          angle = 170
          break
        case 'right':
          recenterDistance = 330 + 1000
          angle = 17
          break
        case 'up-right':
          recenterDistance = 330 + 1000
          angle = 45
          break
      }
      break
    case 'polyline':
      switch (side) {
        case 'left':
          recenterDistance = 330 + 5000
          angle = 180
          break
        case 'up-left':
          recenterDistance = 330 + 2500
          angle = 165
          break
        case 'right':
          recenterDistance = 330 + 1000
          angle = 0
          break
        case 'up-right':
          recenterDistance = 330 + 1000
          angle = 23
          break
      }
      break
    case 'bayesian':
      switch (side) {
        case 'up':
          recenterDistance = 1100
          angle = 110
          break
        case 'down':
          recenterDistance = 1500
          angle = 260
          break
        case 'left':
          recenterDistance = 3000
          angle = 177
          break
        case 'up-left':
          recenterDistance = 330 + 2500
          angle = 165
          break
        case 'right':
          recenterDistance = 1000
          angle = 32
          break
        case 'down-right':
          recenterDistance = 1500
          angle = 320
          break
        case 'down-left':
          recenterDistance = 1500
          angle = 210
          break
        case 'top-left':
          recenterDistance = 4500
          angle = 150
          break
      }
      break
    case 'bayesianPolyline':
      switch (side) {
        case 'up':
          recenterDistance = 1000
          angle = 90
          break
        case 'down':
          recenterDistance = 1500
          angle = 270
          break
        case 'left':
          recenterDistance = 3000
          angle = 180
          break
        case 'right':
          recenterDistance = 1000
          angle = 0
          break
        case 'down-right':
          recenterDistance = 1500
          angle = 320
          break
        case 'down-left':
          recenterDistance = 1500
          angle = 210
          break
        case 'top-left':
          recenterDistance = 4500
          angle = 150
          break
      }
      break
  }

  const newPos = recenterLatLng(
    position.lat,
    position.lng,
    recenterDistance,
    angle,
  )

  // // console.log('newpos: ', newPos)
  // // console.log('angle', angle)
  return newPos
}

const getRadiusFromSliderValue = (sliderValue) => {
  return metersPerSliderStep * sliderValue
}

const metersPerPx = (latitude, zoom) => {
  return (
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom)
  )
}

const recenterLatLng = (lat, lng, radius, angle, r_earth = 6378) => {
  // radius in meters

  const dx = radius * Math.cos((angle * Math.PI) / 180)
  const dy = radius * Math.sin((angle * Math.PI) / 180)

  const new_latitude = lat + (dy / 1000 / r_earth) * (180 / Math.PI)
  const new_longitude =
    lng +
    ((dx / 1000 / r_earth) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180)

  const newPosition = {
    lat: Number(new_latitude.toFixed(5)),
    lng: Number(new_longitude.toFixed(5)),
  }

  return newPosition
}

const googleMapsLibraries: LoadScriptProps['libraries'] = ['visualization']

const Map = ({
  apikey,
  mapType,
  mapWidth = '100vw',
  mapHeight = '100vh',
  currentLocation,
  setCurrentLocation,
  zoomControlPosition,
  currentCenter,
  setCurrentCenter,
  currentZoom,
  setCurrentZoom,
  setSliderValueList,
  sliderValueList,
  currentLocationIsHovered,
  lockedSliderState,
  lockState,
  unlockState,
}) => {
  const mapRef = useRef(null)

  let mapOptions

  switch (mapType) {
    case 'heatmap':
      mapOptions = heatmapMapOptions
      break
    case 'bayesian':
      mapOptions = bayesianMapOptions
      break
    case 'overview':
      mapOptions = overviewMapOptions
      break
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apikey,
    preventGoogleFontsLoading: false,
    nonce: 'uid-12345',
    libraries: googleMapsLibraries,
  })

  function handleZoomChanged() {
    setCurrentZoom(this.getZoom())
  }

  function handleCenterChanged() {
    if (!mapRef.current) return

    const newPos = mapRef.current.getCenter().toJSON()
    setCurrentCenter(newPos)
  }

  return isLoaded ? (
    <>
      <Flex flexDir={'row'} w={mapWidth} h={mapHeight} zIndex={10}>
        <Box zIndex={10}>
          <GoogleMap
            mapContainerStyle={{
              width: mapWidth,
              height: mapHeight,
            }}
            center={new google.maps.LatLng(currentCenter)}
            zoom={currentZoom}
            onDragEnd={handleCenterChanged}
            onZoomChanged={handleZoomChanged}
            onLoad={(map) => {
              mapRef.current = map
            }}
            clickableIcons={false}
            options={{
              ...mapOptions,
              zoomControlOptions: {
                position:
                  zoomControlPosition == 'left'
                    ? google.maps.ControlPosition.LEFT_CENTER
                    : google.maps.ControlPosition.RIGHT_CENTER,
              },
              disableDoubleClickZoom: true,
            }}
          >
            {['heatmap', 'bayesian', 'overview'].includes(mapType) &&
              Object.keys(locations).map((key) => {
                return (
                  <HeatmapLayer
                    key={key}
                    data={[
                      new google.maps.LatLng(
                        locations[key].position.lat,
                        locations[key].position.lng,
                      ),
                    ]}
                    options={{
                      // zIndex: 100,
                      radius:
                        getRadiusFromSliderValue(sliderValueList[key]) /
                        metersPerPx(currentCenter.lat, currentZoom),
                      // gradient:
                      gradient: heatMapColorGradient,
                      opacity:
                        currentLocationIsHovered && key == currentLocation
                          ? 0.9
                          : 0.7,
                    }}
                  />
                )
              })}

            {['urne', 'heatmap', 'bayesian'].includes(mapType) &&
              Object.keys(locations).map((l, index) => {
                return (
                  <MarkerF
                    key={index}
                    position={new google.maps.LatLng(locations[l].position)}
                    clickable={false}
                  ></MarkerF>
                )
              })}

            {['heatmap', 'overview'].includes(mapType) &&
              Object.keys(locations).map((locationKey, index) => {
                return (
                  <InfoBox
                    key={locationKey}
                    options={{
                      closeBoxURL: '',
                      enableEventPropagation: true,
                    }}
                    position={
                      new google.maps.LatLng(
                        // recenterMapObject(
                        //   locations[locationKey].position,
                        //   getRecenterDirection(locationKey, 'c2'),
                        //   'infobox',
                        // ),
                        recenterLatLng(
                          locations[locationKey].position.lat,
                          locations[locationKey].position.lng,
                          locations[locationKey]['infoBoxZoomLevel'][
                            currentZoom
                          ].infoBoxDistance,
                          locations[locationKey]['infoBoxZoomLevel'][
                            currentZoom
                          ].infoBoxAngle,
                        ),
                      )
                    }
                  >
                    <InfoCard
                      locationKey={locationKey}
                      sliderValueList={sliderValueList}
                      setSliderValueList={setSliderValueList}
                      lockedSliderState={lockedSliderState}
                      lockState={lockState}
                      unlockState={unlockState}
                    ></InfoCard>
                  </InfoBox>
                )
              })}

            {['bayesian'].includes(mapType) &&
              Object.keys(locations).map((locationKey, index) => {
                return (
                  <InfoBox
                    key={locationKey}
                    options={{
                      closeBoxURL: '',
                      enableEventPropagation: true,
                    }}
                    // anchor={
                    //   new google.maps.Marker({
                    //     position: {
                    //       lat: locations[locationKey].position.lat,
                    //       lng: locations[locationKey].position.lng,
                    //     },
                    //   })
                    // }
                    position={
                      new google.maps.LatLng(
                        recenterMapObject(
                          locations[locationKey].position,
                          locationKey == currentLocation && currentZoom == 14
                            ? 'up'
                            : getRecenterDirection(
                                locationKey,
                                'bayesian',
                                currentZoom,
                              ),
                          'bayesian',
                          currentZoom,
                        ),
                      )

                      //   recenterLatLng(
                      //     locations[locationKey].position.lat,
                      //     locations[locationKey].position.lng,
                      //     locations[locationKey]['infoBoxZoomLevel'][
                      //       currentZoom
                      //     ].infoBoxDistanceBayesian,
                      //     locations[locationKey]['infoBoxZoomLevel'][
                      //       currentZoom
                      //     ].infoBoxAngleBayesian,
                      //   ),
                      // )
                    }
                  >
                    <InfoBoxBayesian
                      locationKey={index}
                      sliderValueList={sliderValueList}
                      lockedSliderState={lockedSliderState}
                      setCurrentLocation={setCurrentLocation}
                      boxIsHovered={
                        currentLocationIsHovered &&
                        currentLocation == locationKey
                      }
                    ></InfoBoxBayesian>
                  </InfoBox>
                )
              })}

            {[''].includes(mapType) &&
              [0].map((locationKey) => {
                return (
                  <InfoBox
                    key={locationKey}
                    options={{
                      closeBoxURL: '',
                      enableEventPropagation: true,
                    }}
                    position={
                      new google.maps.LatLng(
                        recenterLatLng(
                          locations[locationKey].position.lat,
                          locations[locationKey].position.lng,
                          sliderValueList[locationKey] * metersPerSliderStep,
                          // locations[locationKey]['infoBoxZoomLevel'][
                          //   currentZoom
                          // ].infoBoxDistance,
                          90,
                        ),
                      )
                    }
                  >
                    <Box
                      // transform={'translate(-50%)'}
                      // color={'white'}
                      width={'100px'}
                      zIndex={100}
                      // _hover={""}
                      // bg={'orange'}
                      bg={
                        locationKey == currentLocation &&
                        currentLocationIsHovered
                          ? 'orange.200'
                          : 'blue.200'
                      }
                      border={'2px solid black'}
                      onClick={() => console.log(currentLocation, locationKey)}
                    >
                      {`${sliderValueList[locationKey] * metersPerSliderStep}m`}
                    </Box>
                  </InfoBox>
                )
              })}

            {['bayesian'].includes(mapType) &&
              Object.keys(locations).map((locationKey) => {
                return (
                  <Polyline
                    key={locationKey}
                    path={[
                      new google.maps.LatLng(locations[locationKey].position),
                      new google.maps.LatLng(
                        recenterMapObject(
                          locations[locationKey].position,

                          locationKey == currentLocation && currentZoom == 14
                            ? 'up'
                            : getRecenterDirection(
                                locationKey,
                                'bayesian',
                                currentZoom,
                              ),
                          'bayesianPolyline',
                          currentZoom,
                        ),
                      ),
                    ]}
                    options={{
                      strokeColor: 'black',
                      strokeOpacity: 0.8,
                      strokeWeight: 0.8,
                      clickable: false,
                      draggable: false,
                      editable: false,
                      visible: true,
                    }}
                  />
                )
              })}

            {['heatmap'].includes(mapType) &&
              Object.keys(locations).map((locationKey) => {
                return (
                  <Polyline
                    key={locationKey}
                    path={[
                      new google.maps.LatLng(locations[locationKey].position),
                      new google.maps.LatLng(
                        recenterLatLng(
                          locations[locationKey].position.lat,
                          locations[locationKey].position.lng,
                          locations[locationKey]['infoBoxZoomLevel'][
                            currentZoom
                          ].infoBoxDistance,
                          locations[locationKey]['infoBoxZoomLevel'][
                            currentZoom
                          ].polyLineAngle,
                        ),
                        // recenterMapObject(
                        //   locations[locationKey].position,
                        //   getRecenterDirection(locationKey, 'c2'),
                        //   'polyline',
                        // ),
                      ),
                    ]}
                    options={{
                      strokeColor: 'black',
                      strokeOpacity: 0.8,
                      strokeWeight: 1.5,
                      clickable: false,
                      draggable: false,
                      editable: false,
                      visible: true,
                    }}
                  />
                )
              })}
          </GoogleMap>
        </Box>
      </Flex>
    </>
  ) : (
    <></>
  )
}

export default React.memo(Map)
