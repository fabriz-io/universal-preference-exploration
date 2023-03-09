import { quantile_radius } from './geo_functions'
import { linspace } from './functions'

const production_host = ''

const api_host =
  process.env.STAGE == 'local' || process.env.NODE_ENV == 'development'
    ? 'localhost:5000'
    : production_host

const minEpsilon = 0.01
const maxEpsilon = 10
const minRadius = quantile_radius(maxEpsilon)
const maxRadius = 1200

const locationsRaw = {
  0: {
    description: 'Zuhause',
    position: { lat: 52.47707, lng: 13.39887 },
    infoBoxZoomLevel: {
      15: {
        infoBoxAngle: 160,
        polyLineAngle: 160,
        infoBoxDistance: 1900,
        polyLineDistance: 1500,
        infoBoxAngleBayesian: 255,
        infoBoxDistanceBayesian: 1400,
        polyLineAngleBayesian: 260,
        polyLineDistanceBayesian: 1500,
      },
      14: {
        infoBoxAngle: 160,
        polyLineAngle: 160,
        infoBoxDistance: 3400,
        polyLineDistance: 1500,
        infoBoxAngleBayesian: 255,
        infoBoxDistanceBayesian: 1400,
        polyLineAngleBayesian: 260,
        polyLineDistanceBayesian: 1500,
      },
      13: {
        infoBoxAngle: 160,
        polyLineAngle: 160,
        infoBoxDistance: 5200,
        polyLineDistance: 1500,
        infoBoxAngleBayesian: 255,
        infoBoxDistanceBayesian: 1400,
        polyLineAngleBayesian: 260,
        polyLineDistanceBayesian: 1500,
      },
      12: {
        infoBoxAngle: 220,
        infoBoxDistance: 6400,
        polyLineAngle: 222,
        polyLineDistance: 1500,
        infoBoxAngleBayesian: 255,
        infoBoxDistanceBayesian: 1400,
        polyLineAngleBayesian: 260,
        polyLineDistanceBayesian: 1500,
      },
    },
  },
  1: {
    description: 'Café',
    position: { lat: 52.4940596, lng: 13.4204306 },
    infoBoxZoomLevel: {
      15: {
        infoBoxAngle: 130,
        infoBoxDistance: 1900,
        polyLineAngle: 130,
        polyLineDistance: 4500,
        infoBoxAngleBayesian: 100,
        infoBoxDistanceBayesian: 1000,
        polyLineAngleBayesian: 90,
        polyLineDistanceBayesian: 900,
      },
      14: {
        infoBoxAngle: 130,
        infoBoxDistance: 2600,
        polyLineAngle: 130,
        polyLineDistance: 4500,
        infoBoxAngleBayesian: 100,
        infoBoxDistanceBayesian: 1600,
        polyLineAngleBayesian: 90,
        polyLineDistanceBayesian: 1400,
      },
      13: {
        infoBoxAngle: 140,
        infoBoxDistance: 4500,
        polyLineAngle: 140,
        polyLineDistance: 4500,
        infoBoxAngleBayesian: 120,
        infoBoxDistanceBayesian: 1800,
        polyLineAngleBayesian: 110,
        polyLineDistanceBayesian: 1400,
      },
      12: {
        infoBoxAngle: 170,
        infoBoxDistance: 10900,
        polyLineAngle: 170,
        polyLineDistance: 1500,
        infoBoxAngleBayesian: 140,
        infoBoxDistanceBayesian: 4200,
        polyLineAngleBayesian: 120,
        polyLineDistanceBayesian: 2400,
      },
    },
  },
  2: {
    description: 'Persönlicher Ort',
    position: { lat: 52.530807, lng: 13.420689 },
    infoBoxZoomLevel: {
      15: {
        infoBoxAngle: 170,
        infoBoxDistance: 2100,
        polyLineAngle: 170,
        polyLineDistance: 1300,
        infoBoxAngleBayesian: 100,
        infoBoxDistanceBayesian: 1000,
        polyLineAngleBayesian: 90,
        polyLineDistanceBayesian: 900,
      },
      14: {
        infoBoxAngle: 170,
        infoBoxDistance: 3400,
        polyLineDistance: 2400,
        polyLineAngle: 170,
        infoBoxAngleBayesian: 100,
        infoBoxDistanceBayesian: 1400,
        polyLineAngleBayesian: 90,
        polyLineDistanceBayesian: 1200,
      },
      13: {
        infoBoxAngle: 30,
        infoBoxDistance: 1500,
        polyLineAngle: 0,
        polyLineDistance: 1500,
        infoBoxAngleBayesian: 100,
        infoBoxDistanceBayesian: 1400,
        polyLineAngleBayesian: 90,
        polyLineDistanceBayesian: 1200,
      },
      12: {
        infoBoxAngle: 165,
        infoBoxDistance: 10500,
        polyLineAngle: 170,
        polyLineDistance: 2300,
        infoBoxAngleBayesian: 100,
        infoBoxDistanceBayesian: 2500,
        polyLineAngleBayesian: 90,
        polyLineDistanceBayesian: 2200,
      },
    },
  },
  3: {
    description: 'Arbeitsstelle',
    position: { lat: 52.4960596, lng: 13.435206 },
    infoBoxZoomLevel: {
      15: {
        infoBoxAngle: 45,
        infoBoxAngleBayesian: 45,
        infoBoxDistance: 1500,
        infoBoxDistanceBayesian: 1500,
        polyLineAngle: 43,
        polyLineAngleBayesian: 43,
        polyLineDistance: 1500,
        polyLineDistanceBayesian: 1500,
      },
      14: {
        infoBoxAngle: 45,
        infoBoxAngleBayesian: 100,
        infoBoxDistance: 1500,
        infoBoxDistanceBayesian: 1500,
        polyLineAngle: 43,
        polyLineAngleBayesian: 90,
        polyLineDistance: 1500,
        polyLineDistanceBayesian: 1500,
      },
      13: {
        infoBoxAngle: 45,
        infoBoxAngleBayesian: 45,
        infoBoxDistance: 1500,
        infoBoxDistanceBayesian: 1500,
        polyLineAngle: 26,
        polyLineAngleBayesian: 43,
        polyLineDistance: 1500,
        polyLineDistanceBayesian: 1500,
      },
      12: {
        infoBoxAngle: 60,
        infoBoxDistance: 5500,
        polyLineAngle: 33,
        polyLineDistance: 3500,
        infoBoxDistanceBayesian: 1700,
        polyLineDistanceBayesian: 1500,
        infoBoxAngleBayesian: 40,
        polyLineAngleBayesian: 30,
      },
    },
  },
  4: {
    description: 'U-Bahn Station',
    position: { lat: 52.47937, lng: 13.40947 },
    infoBoxZoomLevel: {
      15: {
        infoBoxAngle: 10,
        infoBoxAngleBayesian: 10,
        infoBoxDistance: 1200,
        infoBoxDistanceBayesian: 1200,
        polyLineAngle: 8,
        polyLineAngleBayesian: 8,
        polyLineDistance: 2800,
        polyLineDistanceBayesian: 2800,
      },
      14: {
        infoBoxAngle: 10,
        infoBoxDistance: 1500,
        polyLineAngle: 8,
        polyLineDistance: 2800,
        infoBoxAngleBayesian: 120,
        infoBoxDistanceBayesian: 1800,
        polyLineDistanceBayesian: 1400,
        polyLineAngleBayesian: 110,
      },
      13: {
        infoBoxAngle: 10,
        infoBoxAngleBayesian: 10,
        infoBoxDistance: 2500,
        infoBoxDistanceBayesian: 2500,
        polyLineAngle: 8,
        polyLineAngleBayesian: 8,
        polyLineDistance: 2800,
        polyLineDistanceBayesian: 2800,
      },
      12: {
        infoBoxAngle: 10,
        infoBoxAngleBayesian: 10,
        infoBoxDistance: 2500,
        infoBoxDistanceBayesian: 2500,
        polyLineAngle: 8,
        polyLineAngleBayesian: 8,
        polyLineDistance: 2800,
        polyLineDistanceBayesian: 2800,
      },
    },
  },
}

const locations = Object.keys(locationsRaw).map((locationKey) => {
  return {
    ...locationsRaw[locationKey],
    position: {
      lat: locationsRaw[locationKey].position.lat,
      lng: locationsRaw[locationKey].position.lng - 0.1,
    },
  }
})

const heatMapBounds = {
  north: 52.620007,
  south: 52.350007,
  west: 13.000689,
  east: 13.660689,
}

const bayesianMapBounds = {
  north: 52.620007,
  south: 52.350007,
  west: 13.000689,
  east: 13.660689,
}

// const overviewMapBounds =

const minMapZoom = 12
const maxMapZoom = 15
const maxBarWidth = '300px'
const maxBarHeight = '300px'

const bayesianMapOptions = {
  disableDefaultUI: false,
  // gestureHandling: 'auto',
  fullscreenControl: false,
  keyboardShortcuts: false,
  // gestureHandling: 'none',
  mapTypeControl: false,
  minZoom: minMapZoom,
  maxZoom: 14,
  rotateControl: false,
  streetViewControl: false,
  restriction: { latLngBounds: bayesianMapBounds, strictBounds: true },
}

const heatmapMapOptions = {
  disableDefaultUI: false,
  gestureHandling: 'auto',
  fullscreenControl: false,
  keyboardShortcuts: false,
  mapTypeControl: false,
  minZoom: 13,
  maxZoom: maxMapZoom,
  rotateControl: false,
  streetViewControl: false,
  restriction: { latLngBounds: heatMapBounds, strictBounds: true },
}

const overviewMapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'none',
  fullscreenControl: false,
  keyboardShortcuts: false,
  mapTypeControl: false,
  minZoom: 8,
  rotateControl: false,
  streetViewControl: false,
  restriction: {
    latLngBounds: {
      north: 52.700007,
      south: 52.450007,
      west: 13.220689,
      east: 13.570689,
    },
    strictBounds: true,
  },
}

const selectionToInfoBoxBGMapping = {
  0: 'red.800',
  1: 'red.400',
  2: 'red.100',
  3: 'white',
  4: 'green.100',
  5: 'green.400',
  6: 'green.800',
}

// const heatMapColorGradient = [
//   'rgba(255,255,229, 0)',
//   'rgb(255,247,188)',
//   'rgb(254,227,145)',
//   'rgb(254,196,79)',
//   'rgb(254,153,41)',
//   'rgb(236,112,20)',
//   'rgb(204,76,2)',
//   'rgb(153,52,4)',
//   'rgb(102,37,6)',
// ]

const heatMapColorGradient = [
  'rgba(247,244,249, 0)',
  'rgb(231,225,239)',
  'rgb(212,185,218)',
  'rgb(201,148,199)',
  'rgb(223,101,176)',
  'rgb(231,41,138)',
  'rgb(206,18,86)',
  'rgb(152,0,67)',
  'rgb(103,0,31)',
]

const sliderMarkColor = 'gray.300'
const lockedAccordionButtonBG = 'blue.900'
const unlockedAccordionButtonBG = 'blue.600'
const lockedAccordionPanelBG = 'blue.700'
const unlockedAccordionPanelBG = 'blue.400'

const hoveredBackgroundColor = 'orange.300'
const unhoveredBackgroundColor = 'blue.200'

const metersPerSliderStep = 20
const amountSliderSteps = 50
const absoluteSliderDifferenceForConvergence = 5
const normalizedSliderValues = linspace(0, 1, amountSliderSteps)

const sliderSteps = linspace(1, amountSliderSteps, amountSliderSteps)

const infoCardWidth = '330px'

export {
  minEpsilon,
  maxEpsilon,
  minRadius,
  maxRadius,
  locations,
  minMapZoom,
  bayesianMapOptions,
  overviewMapOptions,
  heatmapMapOptions,
  selectionToInfoBoxBGMapping,
  amountSliderSteps,
  maxBarWidth,
  maxBarHeight,
  heatMapColorGradient,
  api_host,
  sliderMarkColor,
  lockedAccordionPanelBG,
  unlockedAccordionPanelBG,
  lockedAccordionButtonBG,
  unlockedAccordionButtonBG,
  normalizedSliderValues,
  sliderSteps,
  hoveredBackgroundColor,
  unhoveredBackgroundColor,
  metersPerSliderStep,
  absoluteSliderDifferenceForConvergence,
  infoCardWidth,
}
