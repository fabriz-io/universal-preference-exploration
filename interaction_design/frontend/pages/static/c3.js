import HelpModal from '../../components/HelpModal'

import InfoAccordion from '../../components/InfoAccordion'
import DonationButton from '../../components/DonationButton'
import Map from '../../components/Map.tsx'
import {
  log_interaction,
  init_user_session,
  set_current_options,
  reinitialize_optimizer,
  submit_feedback_data,
} from '../../utils/apiCalls'

import { MdSave, MdEdit, MdLock } from 'react-icons/md'

import { TbPlus, TbMinus } from 'react-icons/tb'

const mapHeightVH = 100
const mapWidthVW = 49

const initialSelectionVector = [-1, -1, -1, -1, -1]

import { useTracking } from 'react-tracking'

import {
  CheckIcon,
  QuestionIcon,
  LockIcon,
  UnlockIcon,
  DragHandleIcon,
} from '@chakra-ui/icons'

import axios from 'axios'
import Cookies from 'js-cookie'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Icon,
  Button,
  Center,
  Circle as ChakraCircle,
  Modal,
  ModalOverlay,
  ModalContent,
  Link,
  Heading,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

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
  absoluteSliderDifferenceForConvergence,
} from '../../utils/constants'

import {
  getHoveredBackgroundColor,
  getClosestIndex,
} from '../../utils/functions'
import InstructionModal from '../../components/InstructionModal'

const BayesianPage = () => {
  const [eventType, setEventType] = useState('init')
  const [userInteractionCount, setUserInteractionCount] = useState(0)
  const [userID, setUserID] = useState(undefined)
  const [condition, setCondition] = useState(undefined)
  const [logMessage, setLogMessage] = useState(undefined)
  const { Track, trackEvent } = useTracking(
    { component: 'c3', datetime: Date.now() },
    { dispatch: (data) => setLogMessage(data) },
  )

  const [apikey, setApikey] = useState(undefined)
  const [userIsInitialized, setUserIsInitialized] = useState(false)

  const [rawOptimizerValuesLeft, setRawOptimizerValuesLeft] = useState(
    undefined,
  )
  const [rawOptimizerValuesRight, setRawOptimizerValuesRight] = useState(
    undefined,
  )

  const [sliderValueListLeft, setSliderValueListLeft] = useState(undefined)
  const [sliderValueListRight, setSliderValueListRight] = useState(undefined)

  const [lockedSliderState, setLockedSliderState] = useState(
    Object.keys(locations).map(() => {
      return -1
    }),
  )
  const [selectionVector, setSelectionVector] = useState(
    Object.keys(locations).map(() => {
      return -1
    }),
  )

  const initialCenter = {
    lat: 52.4940596,
    lng: 13.3204306,
  }
  const [currentCenter, setCurrentCenter] = useState(initialCenter)

  const [currentLocation, setCurrentLocation] = useState(-1)
  const [currentZoom, setCurrentZoom] = useState(14)

  const [hoveredSide, setHoveredSide] = useState(-1)

  // const [reinitIndex, setReinitIndex] = useState(-1)
  const [reinitCount, setReinitCount] = useState(0)

  const {
    isOpen: instructionIsOpen,
    onOpen: instructionOnOpen,
    onClose: instructionOnClose,
  } = useDisclosure()

  const handleInfoBoxClickLeft = (locationKey) => {
    try {
      const newSelectionVector = selectionVector.map((oldPreference, index) => {
        if (index == locationKey) {
          return 0
        } else {
          return oldPreference
        }
      })

      setSelectionVector(newSelectionVector)

      trackEvent({
        event: 'preference-selection-left',
        userid: userID,
        prolificid: prolificID,
        locationkey: locationKey,
        leftvalue: sliderValueListLeft[locationKey],
        rightvalue: sliderValueListRight[locationKey],
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleInfoBoxClickRight = (locationKey) => {
    try {
      const newSelectionVector = selectionVector.map((oldPreference, index) => {
        if (index == locationKey) {
          return 1
        } else {
          return oldPreference
        }
      })

      setSelectionVector(newSelectionVector)
      trackEvent({
        event: 'preference-selection-right',
        userid: userID,
        locationkey: locationKey,
        leftvalue: sliderValueListLeft[locationKey],
        rightvalue: sliderValueListRight[locationKey],
      })
    } catch (err) {
      console.log(err)
    }
  }

  const changeLocationView = (locationKey) => {
    try {
      if (locationKey >= 0) {
        setCurrentLocation(locationKey)
        setCurrentZoom(14)
        setCurrentCenter(locations[locationKey].position)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const lockState = (locationKey, sliderLockValue) => {
    try {
      // console.log('Entering log state')
      // console.log('old slider values')
      // console.log(sliderValueListLeft)
      // console.log(sliderValueListRight)
      // console.log('location key: ', locationKey)

      const newLockedSliderValuesLeft = sliderValueListLeft.map(
        (oldValue, index) => {
          if (index == locationKey) {
            // console.log('**** seeting new value *****')
            // console.log(sliderLockValue)
            return sliderLockValue
          } else {
            // console.log('seeting old value')
            // console.log('index: ', index, 'lockvalue:', sliderLockValue)
            return oldValue
          }
        },
      )

      const newLockedSliderValuesRight = sliderValueListRight.map(
        (oldValue, index) => {
          if (index == locationKey) {
            // console.log('**** seeting new value *****')
            // console.log(sliderLockValue)
            return sliderLockValue
          } else {
            return oldValue
          }
        },
      )

      const newLockedSliderState = lockedSliderState.map((value, index) => {
        if (index == locationKey) {
          return sliderLockValue
        } else {
          return value
        }
      })

      // console.log('new slider values')
      // console.log(newLockedSliderValuesLeft)
      // console.log(newLockedSliderValuesRight)
      setSliderValueListLeft(newLockedSliderValuesLeft)
      setSliderValueListRight(newLockedSliderValuesRight)
      setLockedSliderState(newLockedSliderState)
      // setCurrentLocation(-1)

      trackEvent({
        userid: userID,
        event: 'lockstate',
        locationkey: locationKey,
        lockedvalue: sliderLockValue,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const unlockState = (locationKey) => {
    try {
      // const newLockedSliderState = lockedSliderState.map((oldState, index) => {
      //   if (index == locationKey) {
      //     return -1
      //   } else {
      //     return oldState
      //   }
      // })

      setReinitCount(reinitCount + 1)
      setEventType('init')
      // console.log(reinitCount)
      // setLockedSliderState(newLockedSliderState)
      // setReinitIndex(locationKey)
      // setCurrentLocation(locationKey)
      trackEvent({
        userid: userID,
        event: 'unlockstate',
        locationkey: locationKey,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleInstructionOnOpen = () => {
    try {
      trackEvent({
        userid: userID,
        event: 'instruction-open-c3',
      }),
        instructionOnOpen()
    } catch (err) {
      console.log(err)
    }
  }

  const handleInstructionOnClose = () => {
    try {
      trackEvent({
        userid: userID,
        event: 'instruction-close-c3',
      }),
        instructionOnClose()
    } catch (err) {
      console.log(err)
    }
  }

  // Effect Hooks ______________________________________________________________

  const [prolificID, setProlificID] = useState(undefined)

  useEffect(() => {
    try {
      // console.log('uef: set cookies')
      const cookieUserID = Cookies.get('userID')
      const cookieCondition = Cookies.get('condition')
      const cookieProlificID = Cookies.get('prolificID')

      setProlificID(cookieProlificID)

      setUserID(cookieUserID)
      setCondition(cookieCondition)
      instructionOnOpen()
      // console.log('log cookies')
      // console.log('cookieUserId: ', cookieUserID)
      // console.log('cookieCondition: ', cookieCondition)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    try {
      // console.log('uef: set location')
      if (currentLocation == -1) {
        setCurrentZoom(12)
        setCurrentCenter(initialCenter)
        // console.log('current location was set')
      } else {
        setCurrentZoom(14)
        setCurrentCenter(locations[currentLocation].position)
        // console.log('current location was set')
      }
      // eslint-disable-line react-hooks/exhaustive-deps
    } catch (err) {
      console.log(err)
    }
  }, [currentLocation])

  useEffect(() => {
    try {
      // console.log('uef: set apikey')
      const get_api_key = async () => {
        try {
          const response = await axios.get(`http://${api_host}/get_api_key`)

          setApikey(response.data.apikey)
          // console.log('api key is set: ', response.data.apikey)
        } catch (err) {
          console.log(err)
        }
      }

      get_api_key()
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    try {
      // console.log('uef: set current options')
      // console.log('setting, if user is initialized...')
      // console.log('user is initialized: ', userIsInitialized)
      // console.log('userId: ', userID)
      if (userID && userIsInitialized) {
        // console.log('user is intialized == true. userId in if clause: ', userID)
        set_current_options(
          userID,
          setRawOptimizerValuesLeft,
          setRawOptimizerValuesRight,
        )
      }
    } catch (err) {
      console.log(err)
    }
  }, [userIsInitialized, userInteractionCount])

  useEffect(() => {
    try {
      // console.log('uef: init user session')
      // console.log('user id in init user session: ', userID)
      if (userID) {
        console.log('userId defined, init user session ', userID)
        init_user_session(userID)
        setUserIsInitialized(true)
        // console.log('setting reinit lock to true')
      }
    } catch (err) {
      console.log(err)
    }
  }, [userID])

  useEffect(() => {
    try {
      if (lockedSliderState.every((element) => element > 0)) {
        // console.log('uef: lock slider state')
        setCurrentLocation(-1)
        trackEvent({
          userid: userID,
          event: 'finalstate-c3',
          condition: condition,
          prolificid: prolificID,
          finalstate: lockedSliderState,
        })
      }
    } catch (err) {
      console.log(err)
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [lockedSliderState])

  useEffect(() => {
    try {
      // console.log('uef: submit feedback data')
      const locationKey = selectionVector.findIndex((element) => element >= 0)
      // console.log('location Key: ', locationKey)
      if (locationKey >= 0) {
        // console.log('Starting submit of feedback..')
        const userFeedback = selectionVector[locationKey]

        // console.log('uef: submitting feedback')
        // console.log(selectionVector)
        // console.log(locationKey)
        // console.log(userFeedback)

        // // console.log('before submit feedback data for location', locationKey)
        // // console.log('with selectionVector: ', selectionVector)
        submit_feedback_data(userID, locationKey, userFeedback)
        setSelectionVector(initialSelectionVector)
        // // console.log('after submit with selection vector:')
        // console.log('uef: feedback submitted')
        // console.log(selectionVector)
        // // console.log()
        setEventType('feedbackSubmitted')
        setUserInteractionCount(userInteractionCount + 1)
        // console.log('feedback submitted')
      } else {
        // console.log('no feedback submitted')
      }
    } catch (err) {
      console.log(err)
    }
  }, [selectionVector, userID])

  useEffect(() => {
    try {
      if (logMessage) {
        log_interaction(logMessage)
      }
    } catch (err) {
      console.log(err)
    }
  }, [logMessage])

  useEffect(() => {
    try {
      if (userID && apikey && condition) {
        trackEvent({
          userid: userID,
          condition: condition,
          event: 'landed-c3',
        })
      }
    } catch (err) {
      console.log(err)
    }
  }, [userID, apikey, condition, trackEvent])

  useEffect(() => {
    try {
      if (reinitCount > 0) {
        reinitialize_optimizer(userID, currentLocation)
        setUserInteractionCount(userInteractionCount + 1)
      }
    } catch (err) {
      console.log(err)
    }
  }, [reinitCount])

  useEffect(() => {
    try {
      // console.log('uef: slider setter')

      // console.log('event type', eventType)

      if (rawOptimizerValuesLeft && rawOptimizerValuesRight) {
        // console.log('raw optimizer values defined')

        let newSliderValuesLeft = getClosestIndex(
          rawOptimizerValuesLeft,
          normalizedSliderValues,
        )
        let newSliderValuesRight = getClosestIndex(
          rawOptimizerValuesRight,
          normalizedSliderValues,
        )

        // console.log('new slider states')
        // console.log(newSliderValuesLeft)
        // console.log(newSliderValuesRight)

        if (eventType == 'init') {
          // console.log('if init')
          setSliderValueListLeft(newSliderValuesLeft)
          setSliderValueListRight(newSliderValuesRight)
          setLockedSliderState(
            lockedSliderState.map((value, index) => {
              if (index == currentLocation) {
                return -1
              } else {
                return value
              }
            }),
          )
          setEventType('')
        } else if (eventType == 'feedbackSubmitted') {
          // console.log('if feedbacksubmitted')
          // console.log('event type: ', eventType)
          // console.log('old locked state')
          // console.log(lockedSliderState)
          if (
            Math.abs(
              newSliderValuesLeft[currentLocation] -
                newSliderValuesRight[currentLocation],
            ) <= absoluteSliderDifferenceForConvergence
          ) {
            const newLockedSliderValue = Math.round(
              (newSliderValuesLeft[currentLocation] +
                newSliderValuesRight[currentLocation]) /
                2,
            )

            const newLockedSliderState = lockedSliderState.map(
              (value, index) => {
                if (index == currentLocation) {
                  return newLockedSliderValue
                } else {
                  return value
                }
              },
            )

            setLockedSliderState(newLockedSliderState)

            newSliderValuesLeft = newSliderValuesLeft.map((value, index) => {
              if (index == currentLocation) {
                return newLockedSliderValue
              } else {
                return value
              }
            })

            newSliderValuesRight = newSliderValuesRight.map((value, index) => {
              if (index == currentLocation) {
                return newLockedSliderValue
              } else {
                return value
              }
            })
          }
          setSliderValueListLeft(newSliderValuesLeft)
          setSliderValueListRight(newSliderValuesRight)

          setEventType('')
        }
      } else {
        // console.log('raw optimizer values not defined')
      }
    } catch (err) {
      console.log(err)
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [rawOptimizerValuesLeft, rawOptimizerValuesRight])

  return (
    <Track>
      {userIsInitialized &&
        userID &&
        apikey &&
        sliderValueListLeft &&
        sliderValueListRight && (
          <>
            <Box>
              <Flex
                w={'100vw'}
                flexDir={'row'}
                h={'100vh'}
                justifyContent={'center'}
              >
                {sliderValueListLeft &&
                  sliderValueListRight &&
                  ['left', 'right'].map((key) => {
                    return (
                      <Center
                        key={key}
                        position={'relative'}
                        border={'2px solid black'}
                        width={'100%'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <Map
                          trackEvent={trackEvent}
                          apikey={apikey}
                          zoomControlPosition={key}
                          key={key}
                          mapType="bayesian"
                          mapWidth={`${mapWidthVW}vw`}
                          mapHeight={`${mapHeightVH}vh`}
                          currentCenter={{
                            ...currentCenter,
                            lng:
                              key == 'left'
                                ? currentCenter.lng + 0.01
                                : currentCenter.lng - 0.01,
                          }}
                          setCurrentCenter={setCurrentCenter}
                          currentZoom={currentZoom}
                          setCurrentZoom={setCurrentZoom}
                          currentLocation={currentLocation}
                          setCurrentLocation={setCurrentLocation}
                          lockedSliderState={lockedSliderState}
                          sliderValueList={
                            key == 'left'
                              ? sliderValueListLeft
                              : sliderValueListRight
                          }
                          // infoboxBGColor={() =>
                          //   getHoveredBackgroundColor(hoveredSide, locationKey)
                          // }
                          hoveredSide={hoveredSide}
                          // hoveredBGColorArray={hoveredBGColorArray}
                          getHoveredBackgroundColor={getHoveredBackgroundColor}
                          currentLocationIsHovered={
                            key == 'left' && hoveredSide == 0
                              ? true
                              : key == 'right' && hoveredSide == 1
                              ? true
                              : false
                          }
                          // hove
                        ></Map>
                      </Center>
                    )
                  })}
              </Flex>

              <Flex
                height={'100vh'}
                position={'absolute'}
                top={0}
                left={'50%'}
                transform={'translate(-50%)'}
                zIndex={'100'}
                // border={'3px solid green'}
                flexDirection={'column'}
                // height={'100%'}
                alignItems={'center'}
                // w={'100vw'}
                gap={'10'}
                // justifyContent={'space-between'}
              >
                <Box>
                  <InfoAccordion
                    condition={'c3'}
                    accordionWidth={'270px'}
                    // cardState={cardStateLxä}
                    lockedSliderState={lockedSliderState}
                    sliderValueList={sliderValueListLeft}
                    setSliderValueList={setSliderValueListLeft}
                    sliderValueListLeft={sliderValueListLeft}
                    setSliderValueListLeft={setSliderValueListLeft}
                    sliderValueListRight={sliderValueListRight}
                    setSliderValueListRight={setSliderValueListRight}
                    lockState={lockState}
                    unlockState={unlockState}
                    hoveredSide={hoveredSide}
                    setHoveredSide={setHoveredSide}
                    trackEvent={trackEvent}
                    changeLocationView={changeLocationView}
                    tabIndex={currentLocation}
                    setCurrentLocation={setCurrentLocation}
                    setCurrentZoom={setCurrentZoom}
                    setCurrentCenter={setCurrentCenter}
                    handleInfoBoxClickLeft={handleInfoBoxClickLeft}
                    handleInfoBoxClickRight={handleInfoBoxClickRight}
                    handleTabsChange={setCurrentLocation}
                  ></InfoAccordion>
                </Box>
                {lockedSliderState.every((element) => element >= 0) ? (
                  <Box>
                    <DonationButton></DonationButton>
                  </Box>
                ) : (
                  <></>
                )}
              </Flex>
              <InstructionModal
                instructionIsOpen={instructionIsOpen}
                instructionOnOpen={handleInstructionOnOpen}
                instructionOnClose={handleInstructionOnClose}
                trackEvent={trackEvent}
              >
                <OrderedList spacing={'12px'}>
                  <ListItem>
                    Wählen Sie einen Ort aus der Liste in der Mitte aus. Für
                    diesen Ort werden dann zwei mögliche Privatsphäre-Niveaus
                    rechts und links visualisiert.
                  </ListItem>
                  <ListItem>
                    Klicken Sie auf den angezeigten Balken des
                    Privatsphäre-Niveaus, welches Ihren Präferenzen eher
                    entspricht.
                  </ListItem>
                  <ListItem>Nun gibt es zwei Möglichkeiten:</ListItem>

                  <Flex>
                    <Box mr={'8px'}>{'a)'}</Box>
                    <Box>
                      Das System schlägt Ihnen solange neue Privatsphäre-Niveaus
                      vor, bis es glaubt Ihre Präferenzen zu kennen. Das System
                      speichert ihr Privatsphäre-Niveau automatisch.
                    </Box>
                  </Flex>
                  <Flex>
                    <Box mr={'8px'}>{'b)'}</Box>
                    <Box>
                      Sie sind mit einem Systemvorschlag einverstanden und
                      speichern Ihr präferiertes Privatsphäre-Niveau manuell.
                    </Box>
                  </Flex>

                  <ListItem>Wählen Sie einen neuen Ort aus.</ListItem>
                </OrderedList>
                {/* <Box>
                1. Wählen Sie einen Ort aus. Für diesen Ort werden dann zwei
                mögliche Privatssphäre-Niveaus angeboten.
              </Box>
              <Box>
                2. Entscheiden Sie, mit welchem der beiden Privatssphäre-Niveaus
                Sie Ihre Daten eher teilen würden, indem Sie dafür auf den
                entsprechenden Balken klicken. Es werden automatisch zwei neue
                Privatsphäre-Niveaus präsentiert.
              </Box>
              <Box>
                3. Die Bedienoberfläche lernt durch Ihre wiederholten Eingaben
                Ihr Privatssphäre-Niveau. Dieser Vorgang des Lernens ist
                abgeschlossen, wenn sich die Hintergrundfarbe ändert und das{' '}
                <Icon as={MdLock}></Icon> Symbol angezeigt wird.
              </Box>
              <Box>
                Sie können ein angezeigtes Privatsphäre-Niveau auch manuell
                einloggen mit einem Klick auf <Icon as={MdSave}></Icon>.
              </Box> */}
              </InstructionModal>
            </Box>
            {/* <Box
            onClick={() => console.log(currentLocation, typeof currentLocation)}
          >
            Test
          </Box> */}
          </>
        )}

      <HelpModal />
    </Track>
  )
}

export default BayesianPage
