const scaling_factor = 1

function latLonToOffsets(latitude, longitude, mapWidth, mapHeight) {
  const FE = 180 // false easting
  const radius = mapWidth / (2 * Math.PI)

  const latRad = degreesToRadians(latitude)
  const lonRad = degreesToRadians(longitude + FE)

  const x = lonRad * radius

  const yFromEquator = radius * Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = mapHeight / 2 - yFromEquator

  return { x, y }
}

const LatLontoXY = (lat_center, lon_center, zoom) => {
  const C = (256 / (2 * Math.PI)) * 2 ** zoom

  const x = C * (lon_center * (Math.PI / 180.0) + Math.PI)
  const y =
    C *
    (Math.PI -
      Math.log(Math.tan(Math.PI / 4 + (lat_center * (Math.PI / 180.0)) / 2)))

  return { x, y }
}

const xy2LatLon = (
  lat_center,
  lon_center,
  zoom,
  width_internal,
  height_internal,
  pxX_internal,
  pxY_internal,
) => {
  let XYcenter = LatLontoXY(lat_center, lon_center, zoom)

  // xPoint = xcenter - (width_internal / 2 - pxX_internal)
  // ypoint = ycenter - (height_internal / 2 - pxY_internal)

  const xPoint = XYcenter.x - width_internal / 2
  const ypoint = XYcenter.y - height_internal / 2

  const C = (256 / (2 * Math.PI)) * 2 ** zoom
  const M = xPoint / C - Math.PI
  const N = -(ypoint / C) + Math.PI

  const lng = M * (180 / Math.PI)
  const lat = (Math.atan(Math.exp(N)) - Math.PI / 4) * 2 * (180 / Math.PI)

  return { lat, lng }
}

const quantile_radius = (epsilon) => {
  const exact_quantile_radius =
    epsilon == 0 ? 3.88972 / 0.01 : 3.88972 / epsilon

  return exact_quantile_radius * scaling_factor
}

const quantile_epsilon = (radius) => {
  const exact_epsilon = 3.88972 / radius
  return exact_epsilon * scaling_factor
}

const metersPerPx = (latitude, zoom) => {
  return (
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom)
  )
}

const pxPerMeters = (latitude, zoom) => {
  return (
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom)
  )
}

export { quantile_radius, xy2LatLon, metersPerPx, quantile_epsilon }
