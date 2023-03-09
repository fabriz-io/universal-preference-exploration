import {
  getHoveredBackgroundColor,
  getClosestIndex,
  linspace,
} from './functions'

import {
  minEpsilon,
  maxEpsilon,
  minRadius,
  maxRadius,
  mapBounds,
  minMapZoom,
  locations,
  amountSliderSteps,
  maxBarWidth,
  api_host,
  normalizedSliderValues,
} from './constants'

import Cookies from 'js-cookie'
import axios from 'axios'

const get_conditon = async (userId, conditionSetter) => {
  try {
    const response = await axios.get(
      `http://${api_host}/get_condition/${userId}`,
      {
        headers: { 'content-type': 'application/json' },
      },
    )

    // console.log('Logged Message:', response.data)

    Cookies.set('condition', response.data.condition, { sameSite: 'Lax' })

    conditionSetter(response.data.condition)
  } catch (err) {
    console.log(err)
  }
}

const log_interaction = async (log_message) => {
  try {
    const response = await axios.post(`http://${api_host}/log`, log_message, {
      headers: { 'content-type': 'application/json' },
    })
    // console.log('Logged Message:', response.data)
  } catch (err) {
    console.log(err)
  }
}

const init_user_session = async (user_id) => {
  const num_dims = 5
  try {
    const response = await axios.get(
      `http://${api_host}/init/${user_id}/${num_dims}`,
    )
    // console.log('user session: ')
    // console.log(response.data)
  } catch (err) {
    console.log(err)
  }
}

const reinitialize_optimizer = async (userID, optimizerIndex) => {
  try {
    const response = await axios.get(
      `http://${api_host}/reinitialize_optimizer/${userID}/${optimizerIndex}`,
    )

    // console.log('async: reinit optimizer')
    // console.log('response: ', response)
  } catch (err) {
    // console.log(err)
  }
}

const set_current_options = async (userID, stateSetter1, stateSetter2) => {
  try {
    // console.log('api: set_current_options api call')
    // console.log(userID)
    const response = await axios.get(
      `http://${api_host}/get_current_options/${userID}`,
    )
    // console.log('response: ')
    // console.log(response.data)
    stateSetter1(response.data.option_1)
    stateSetter2(response.data.option_2)
  } catch (err) {
    console.log(err)
  }
}

const get_initial_options = async (
  userID,
  stateSetter1,
  stateSetter2,
  initialLocationIndexes,
) => {
  try {
    // // console.log('_____ start get initial options ____')
    let reinitIteration = reinitCount
    let locationIndexes = [...initialLocationIndexes]
    let current_options_response
    let fetchedSliderStates1
    let fetchedSliderStates2

    // if (reinitCount <= 0) {
    //   locationIndexes = [0, 1, 2, 3, 4]
    //   reinitIteration = 0
    // } else {
    //   locationIndexes = [currentLocation]
    //   reinitIteration = 1
    // }

    // current_options_response = await axios.get(
    //   `http://${api_host}/get_current_options/${userID}`,
    // )
    // // console.log(
    //   'current options response before while loop',
    //   current_options_response.data,
    // )

    locationIndexes.forEach(async (element) => {
      // // console.log('reinit fetch for location', element)
      let reinit_response = await axios.get(
        `http://${api_host}/reinitialize_optimizer/${userID}/${element}`,
      )
      // console.log(reinit_response)
    })

    current_options_response = await axios.get(
      `http://${api_host}/get_current_options/${userID}`,
    )

    stateSetter1(current_options_response.data.option_1)
    stateSetter2(current_options_response.data.option_2)

    // while (locationIndexes.length > 0) {
    //   // // console.log('reinit iteration', reinitIteration)
    //   // // console.log('locationIndexes: ', locationIndexes)

    //   if (reinitIteration > 0) {
    //   }

    //   // console.log(
    //     'current options response before get closest index',
    //     current_options_response.data,
    //   )

    //   // // console.log('newSliderStates before get closest index')
    //   // // console.log(newSliderState1)
    //   // // console.log(newSliderState2)

    //   fetchedSliderStates1 = getClosestIndex(
    //     current_options_response.data.option_1,
    //     normalizedSliderValues,
    //   )

    //   fetchedSliderStates2 = getClosestIndex(
    //     current_options_response.data.option_2,
    //     normalizedSliderValues,
    //   )

    //   // // console.log('fetched slider states')
    //   // // console.log(fetchedSliderStates1)
    //   // // console.log(fetchedSliderStates2)

    //   // // console.log('befor filtering location indices: ', locationIndexes)
    //   locationIndexes = [...locationIndexes].filter((locationIndex) => {
    //     return (
    //       fetchedSliderStates1[locationIndex] ===
    //       fetchedSliderStates2[locationIndex]
    //     )
    //   })

    //   // // console.log('after filtering location indexes', locationIndexes)

    //   reinitIteration++
    // }

    // // // console.log('fetched slider states')
    // // // console.log(fetchedSliderStates1)
    // // // console.log(fetchedSliderStates2)

    // // // console.log('slider states')
    // // // console.log(sliderState1)
    // // // console.log(sliderState2)
    // // // console.log('reinit count', reinitCount)

    // let newSliderState1
    // let newSliderState2

    // if (initialLocationIndexes.length == 1) {
    //   const currentLocation = initialLocationIndexes[0]

    //   newSliderState1 = sliderState1.map((oldState, index) => {
    //     if (index == currentLocation) {
    //       return fetchedSliderStates1[currentLocation]
    //     } else {
    //       return oldState
    //     }
    //   })

    //   newSliderState2 = sliderState2.map((oldState, index) => {
    //     if (index == currentLocation) {
    //       return fetchedSliderStates2[currentLocation]
    //     } else {
    //       return oldState
    //     }
    //   })
    // } else {
    //   newSliderState1 = fetchedSliderStates1
    //   newSliderState2 = fetchedSliderStates2
    // }

    // // // console.log('new slider states states after set old states')
    // // // console.log(newSliderState1)
    // // // console.log(newSliderState2)

    // stateSetter1(newSliderState1)
    // stateSetter2(newSliderState2)

    // // // console.log('_____ finish get initial options ____')
  } catch (err) {
    console.log(err)
  }
}

const get_initial_options_2 = async (
  userID,
  sliderState1,
  sliderState2,
  stateSetter1,
  stateSetter2,
  initialLocationIndexes,
  reinitCount,
) => {
  try {
    // // console.log('_____ start get initial options ____')
    let reinitIteration = reinitCount
    let locationIndexes = [...initialLocationIndexes]
    let current_options_response
    let fetchedSliderStates1
    let fetchedSliderStates2

    // if (reinitCount <= 0) {
    //   locationIndexes = [0, 1, 2, 3, 4]
    //   reinitIteration = 0
    // } else {
    //   locationIndexes = [currentLocation]
    //   reinitIteration = 1
    // }

    // current_options_response = await axios.get(
    //   `http://${api_host}/get_current_options/${userID}`,
    // )
    // // console.log(
    //   'current options response before while loop',
    //   current_options_response.data,
    // )

    while (locationIndexes.length > 0) {
      // // console.log('reinit iteration', reinitIteration)
      // // console.log('locationIndexes: ', locationIndexes)

      if (reinitIteration > 0) {
        locationIndexes.forEach(async (element) => {
          // // console.log('reinit fetch for location', element)
          let reinit_response = await axios.get(
            `http://${api_host}/reinitialize_optimizer/${userID}/${element}`,
          )
          // console.log(reinit_response)
        })
      }

      current_options_response = await axios.get(
        `http://${api_host}/get_current_options/${userID}`,
      )
      // console.log(
      // 'current options response before get closest index',
      // current_options_response.data,
      // )

      // // console.log('newSliderStates before get closest index')
      // // console.log(newSliderState1)
      // // console.log(newSliderState2)

      fetchedSliderStates1 = getClosestIndex(
        current_options_response.data.option_1,
        normalizedSliderValues,
      )

      fetchedSliderStates2 = getClosestIndex(
        current_options_response.data.option_2,
        normalizedSliderValues,
      )

      // // console.log('fetched slider states')
      // // console.log(fetchedSliderStates1)
      // // console.log(fetchedSliderStates2)

      // // console.log('befor filtering location indices: ', locationIndexes)
      locationIndexes = [...locationIndexes].filter((locationIndex) => {
        return (
          fetchedSliderStates1[locationIndex] ===
          fetchedSliderStates2[locationIndex]
        )
      })

      // // console.log('after filtering location indexes', locationIndexes)

      reinitIteration++
    }

    // // console.log('fetched slider states')
    // // console.log(fetchedSliderStates1)
    // // console.log(fetchedSliderStates2)

    // // console.log('slider states')
    // // console.log(sliderState1)
    // // console.log(sliderState2)
    // // console.log('reinit count', reinitCount)

    let newSliderState1
    let newSliderState2

    if (initialLocationIndexes.length == 1) {
      const currentLocation = initialLocationIndexes[0]

      newSliderState1 = sliderState1.map((oldState, index) => {
        if (index == currentLocation) {
          return fetchedSliderStates1[currentLocation]
        } else {
          return oldState
        }
      })

      newSliderState2 = sliderState2.map((oldState, index) => {
        if (index == currentLocation) {
          return fetchedSliderStates2[currentLocation]
        } else {
          return oldState
        }
      })
    } else {
      newSliderState1 = fetchedSliderStates1
      newSliderState2 = fetchedSliderStates2
    }

    // // console.log('new slider states states after set old states')
    // // console.log(newSliderState1)
    // // console.log(newSliderState2)

    stateSetter1(newSliderState1)
    stateSetter2(newSliderState2)

    // // console.log('_____ finish get initial options ____')
  } catch (err) {
    console.log(err)
  }
}

const submit_feedback_data = async (
  user_id,
  optimizer_index,
  selected_index,
) => {
  const payload = {
    user_id: user_id,
    optimizer_index: optimizer_index,
    selected_index: selected_index,
  }

  try {
    const response = await axios.post(
      `http://${api_host}/submit_feedback_data`,
      payload,
      { headers: { 'content-type': 'application/json' } },
    )

    return response

    // const closestIndex1 = getClosestIndex(
    //   response.data.option_1,
    //   normalizedSliderValues,
    // )
    // const closestIndex2 = getClosestIndex(
    //   response.data.option_2,
    //   normalizedSliderValues,
    // )

    // const newSliderState1 = sliderState1.map((oldState, index) => {
    //   if (index == locationKey) {
    //     return closestIndex1[locationKey]
    //   } else {
    //     return oldState
    //   }
    // })

    // const newSliderState2 = sliderState2.map((oldState, index) => {
    //   if (index == locationKey) {
    //     return closestIndex2[locationKey]
    //   } else {
    //     return oldState
    //   }
    // })

    // stateSetter1(newSliderState1)
    // stateSetter2(newSliderState2)
    // if (newSliderState1[locationKey] == newSliderState2[locationKey]) {
    //   setCurrentLocation(-1)
    // }
  } catch (err) {
    console.log(err)
  }
}

export {
  log_interaction,
  init_user_session,
  // get_initial_options,
  set_current_options,
  reinitialize_optimizer,
  submit_feedback_data,
  get_conditon,
}
