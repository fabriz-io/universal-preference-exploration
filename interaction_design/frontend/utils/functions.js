import { unhoveredBackgroundColor, hoveredBackgroundColor } from './constants'

function linspace(startValue, stopValue, cardinality) {
  let arr = []
  let step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(parseFloat((startValue + step * i).toFixed(2)))
  }
  return arr
}

function getClosestIndex(arr1, arr2) {
  // console.log('get closest index')
  // console.log(arr1)
  // console.log(arr2)
  return arr1.map((value) => {
    let closestValue = arr2[0]
    let closestIndex = 0
    let closestDistance = Math.abs(value - closestValue)
    for (let i = 1; i < arr2.length; i++) {
      let distance = Math.abs(value - arr2[i])
      if (distance < closestDistance) {
        closestDistance = distance
        closestValue = arr2[i]
        closestIndex = i
      }
    }
    return closestIndex + 1
  })
}

const getHoveredBackgroundColor = (hoveredSide, side) => {
  switch (hoveredSide) {
    case -1:
      return unhoveredBackgroundColor
    case 0:
      return side == 'left' ? hoveredBackgroundColor : unhoveredBackgroundColor
    case 1:
      return side == 'right' ? hoveredBackgroundColor : unhoveredBackgroundColor
  }
}

const getRadiusFromSliderValue = (step) => {
  // console.log(step)
  return 200 * (step + 1)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}

function arraysAreEqual(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export {
  linspace,
  getClosestIndex,
  getHoveredBackgroundColor,
  getRadiusFromSliderValue,
  getRandomIntInclusive,
  arraysAreEqual,
  shuffleArray,
}
