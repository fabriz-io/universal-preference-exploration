import HelpModal from '../../components/HelpModal'

import NavigationButton from '../../components/NavigationButton'
import DonationButton from '../../components/DonationButton'
import {
  log_interaction,
  init_user_session,
  get_initial_options,
  submit_feedback_data,
  reinitialize_optimizer,
} from '../../utils/apiCalls'

import { getRandomIntInclusive } from '../../utils/functions'
import { locations } from '../../utils/constants'

import {
  minEpsilon,
  maxEpsilon,
  minRadius,
  maxRadius,
  api_host,
  amountSliderSteps,
} from '../../utils/constants'

import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'

import { TbPlus, TbMinus } from 'react-icons/tb'
import Map from '../../components/Map.tsx'
import { useState, useEffect, useRef } from 'react'

import axios from 'axios'

import { LockIcon, UnlockIcon } from '@chakra-ui/icons'

import {
  useDisclosure,
  setSliderValueList,
  Center,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  MdGraphicEq,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Md1KPlus, MdEdit, MdPlusOne, MdSave } from 'react-icons/md'
import InstructionModal from '../../components/InstructionModal'

// const minEpsilon = 0.01
// const maxEpsilon = 10
// const minRadius = quantile_radius(maxEpsilon)
// const maxRadius = 1200
const initialCenter = {
  lat: 52.49737,
  lng: 13.33647,
}

const mapType = ''

const HeatmapSliderPage = () => {
  const [userID, setUserID] = useState(undefined)
  const [condition, setCondition] = useState(undefined)
  const [logMessage, setLogMessage] = useState(undefined)
  const { Track, trackEvent } = useTracking(
    { component: 'c2', datetime: Date.now() },
    { dispatch: (data) => setLogMessage(data) },
  )

  const {
    isOpen: instructionIsOpen,
    onOpen: instructionOnOpen,
    onClose: instructionOnClose,
  } = useDisclosure()

  const [currentLocation, setCurrentLocation] = useState(0)
  const [currentCenter, setCurrentCenter] = useState(initialCenter)
  const [currentZoom, setCurrentZoom] = useState(13)
  const [apikey, setApikey] = useState(undefined)

  const [lockedSliderState, setLockedSliderState] = useState([
    -1,
    -1,
    -1,
    -1,
    -1,
  ])

  const lockState = (locationKey, sliderLockValue) => {
    const newLockedSliderState = lockedSliderState.map((oldState, index) => {
      if (index == locationKey) {
        return sliderLockValue
      } else {
        return oldState
      }
    })

    setLockedSliderState(newLockedSliderState)
    trackEvent({
      userid: userID,
      prolificid: prolificID,
      event: 'lockstate-c2',
      locationkey: locationKey,
      lockedvalue: sliderLockValue,
    })
  }

  const unlockState = (locationKey) => {
    const newLockedSliderState = lockedSliderState.map((oldState, index) => {
      if (index == locationKey) {
        return -1
      } else {
        return oldState
      }
    })

    setLockedSliderState(newLockedSliderState)

    trackEvent({
      userid: userID,
      prolificid: prolificID,
      event: 'unlockstate-c2',
      locationkey: locationKey,
    })
  }

  // const [radiusList, setRadiusList] = useState([100, 154, 490, 834, 411])
  // const [epsilonList, setEpsilonList] = useState(
  //   radiusList.map((r) => maxEpsilon * (1 - r / maxRadius)),
  // )

  // const nextLocation = () => {
  //   setCurrentLocation((currentLocation + 1) % 4)
  // }

  const [prolificID, setProlificID] = useState()
  useEffect(() => {
    const cookieUserID = Cookies.get('userID')
    const cookieCondition = Cookies.get('condition')
    const cookieProlificID = Cookies.get('prolificID')

    setProlificID(cookieProlificID)

    setUserID(cookieUserID)
    setCondition(cookieCondition)
    instructionOnOpen()
  }, [instructionOnOpen])

  useEffect(() => {
    const get_api_key = async () => {
      try {
        const response = await axios.get(`http://${api_host}/get_api_key`)

        setApikey(response.data.apikey)
      } catch (err) {
        console.log(err)
      }
    }

    get_api_key()
  }, [])

  const [sliderValueList, setSliderValueList] = useState(
    Object.keys(locations).map(() =>
      getRandomIntInclusive(1, amountSliderSteps),
    ),
  )

  const handleInstructionOnOpen = () => {
    trackEvent({
      userid: userID,
      prolificid: prolificID,
      event: 'instruction-open-c2',
    })

    instructionOnOpen()
  }

  const handleInstructionOnClose = () => {
    trackEvent({
      userid: userID,
      prolificid: prolificID,
      event: 'instruction-close-c2',
    })
    instructionOnClose()
  }

  useEffect(() => {
    if (logMessage) {
      log_interaction(logMessage)
    }
  }, [logMessage])

  useEffect(() => {
    if (userID) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: 'landed-c2',
      })
    }
  }, [userID, trackEvent, condition])

  useEffect(() => {
    if (lockedSliderState.every((element) => element > 0)) {
      trackEvent({
        userid: userID,
        event: 'finalstate-c2',
        prolificid: prolificID,
        finalstate: lockedSliderState,
      })
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [lockedSliderState])

  return (
    <Track>
      {apikey && userID && condition && (
        <Box position={'relative'} zIndex={50} width={'100vw'} height={'100vh'}>
          <Map
            apikey={apikey}
            mapType="heatmap"
            mapWidth={'100vw'}
            mapHeight={'100vh'}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            // nextLocationSetter={nextLocation}
            currentCenter={currentCenter}
            setCurrentCenter={setCurrentCenter}
            currentZoom={currentZoom}
            setCurrentZoom={setCurrentZoom}
            // radiusList={radiusList}
            // setRadiusList={setRadiusList}
            // epsilonList={epsilonList}
            // setEpsilonList={setEpsilonList}
            minRadius={minRadius}
            maxRadius={maxRadius}
            minEpsilon={minEpsilon}
            maxEpsilon={maxEpsilon}
            sliderValueList={sliderValueList}
            setSliderValueList={setSliderValueList}
            // handleSliderChange={handleSliderChange}
            lockedSliderState={lockedSliderState}
            lockState={lockState}
            unlockState={unlockState}
          ></Map>

          {lockedSliderState.every((element) => element >= 0) &&
          mapType != 'overview' ? (
            <Box
              // bg={'black'}
              position={'absolute'}
              zIndex={100}
              bottom={'10'}
              left={'50%'}
              transform={'translate(-50%)'}
              // translateX={'-50%'}
            >
              <DonationButton></DonationButton>
            </Box>
          ) : (
            <></>
          )}

          <InstructionModal
            instructionIsOpen={instructionIsOpen}
            instructionOnClose={handleInstructionOnClose}
            instructionOnOpen={handleInstructionOnOpen}
          >
            <Box>
              1. Betrachten Sie die Orte auf der Karte und verschieben Sie den
              Regler eines besuchten Ortes auf das gewünschte
              Privatsphäre-Niveau.
            </Box>
            <Flex>
              2. Bestätigen Sie die Auswahl mit{' '}
              <Icon
                boxSize={'30px'}
                borderRadius={'50%'}
                bg={'white'}
                as={MdSave}
                padding={'4px'}
                ml={'5px'}
                border={'1px solid black'}
              ></Icon>
            </Flex>
          </InstructionModal>
        </Box>
      )}

      <HelpModal />
    </Track>
  )
}

export default HeatmapSliderPage
