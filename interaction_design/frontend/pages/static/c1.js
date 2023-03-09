import HelpModal from '../../components/HelpModal'

import InstructionModal from '../../components/InstructionModal'
import NavigationButton from '../../components/NavigationButton'
import DonationButton from '../../components/DonationButton'
import { QuestionIcon } from '@chakra-ui/icons'
import Cookies from 'js-cookie'
import PrivacySlider from '../../components/PrivacySlider'
import InfoCard from '../../components/InfoCard'

import {
  Box,
  Icon,
  Button,
  Circle as ChakraCircle,
  Flex,
  Text,
  useDisclosure,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react'

import { log_interaction } from '../../utils/apiCalls'

import { getRandomIntInclusive } from '../../utils/functions'

import { useState, useEffect } from 'react'
import axios from 'axios'
import InfoAccordion from '../../components/InfoAccordion'
import { useTracking } from 'react-tracking'
import { MdSave, MdEdit } from 'react-icons/md'
import { amountSliderSteps, locations } from '../../utils/constants'

const BasePage = () => {
  const [userID, setUserID] = useState(undefined)
  const [condition, setCondition] = useState(undefined)
  const [logMessage, setLogMessage] = useState(undefined)
  const [currentLocation, setCurrentLocation] = useState(-1)
  const { Track, trackEvent } = useTracking(
    { component: 'c1', datetime: Date.now() },
    { dispatch: (data) => setLogMessage(data) },
  )

  const [sliderValueList, setSliderValueList] = useState(
    Object.keys(locations).map(() =>
      getRandomIntInclusive(1, amountSliderSteps),
    ),
  )

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
    // console.log(newLockedSliderState)
    setLockedSliderState(newLockedSliderState)
    setCurrentLocation(-1)
    trackEvent({
      userid: userID,
      event: 'lockstate-c1',
      prolificID: prolificID,
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
      event: 'unlockstate-c1',
      prolificID: prolificID,
      locationkey: locationKey,
    })
  }

  const {
    isOpen: instructionIsOpen,
    onOpen: instructionOnOpen,
    onClose: instructionOnClose,
  } = useDisclosure()

  const [prolificID, setProlificID] = useState(undefined)

  useEffect(() => {
    const cookieUserID = Cookies.get('userID')
    const cookieCondition = Cookies.get('condition')
    const cookieProlificID = Cookies.get('prolificID')

    setProlificID(cookieProlificID)
    setUserID(cookieUserID)
    setCondition(cookieCondition)
  }, [])

  useEffect(() => {
    if (userID) {
      trackEvent({
        userid: userID,
        condition: condition,
        event: 'landed-c1',
        prolificid: prolificID,
      })
    }
  }, [userID, trackEvent, condition])

  useEffect(() => {
    if (logMessage) {
      log_interaction(logMessage)
    }
  }, [logMessage])

  const handleInstructionOnOpen = () => {
    trackEvent({
      userid: userID,
      event: 'instruction-open-c1',
    }),
      instructionOnOpen()
  }

  const handleInstructionOnClose = () => {
    trackEvent({
      userid: userID,
      event: 'instruction-close-c1',
    }),
      instructionOnClose()
  }

  useEffect(() => {
    if (lockedSliderState.every((element) => element > 0)) {
      trackEvent({
        userid: userID,
        event: 'finalstate-c1',
        prolificid: prolificID,
        finalstate: lockedSliderState,
      })
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [lockedSliderState])

  return (
    <Track>
      {userID && (
        <Flex justifyContent={'center'}>
          <Flex
            mt={'20px'}
            flexDirection={'column'}
            bg={'blue.200'}
            padding={'20px'}
            border={'8px groove black'}
            width={'800px'}
          >
            <Flex fontSize={'l'} flexDirection={'column'} gap={1}>
              <Text>
                Wählen Sie für jeden Ihrer besuchten Orte Ihr individuelles
                Privatsphäre-Niveau aus.
              </Text>

              <Text ml={'10px'} mt={'5px'}>
                1. Verschieben Sie den Regler eines besuchten Ortes auf das
                gewünschte Privatssphäre-Niveau
              </Text>
              <Text ml={'10px'}>
                2. Bestätigen Sie Ihre Auswahl mit{' '}
                <Icon
                  boxSize={'30px'}
                  borderRadius={'50%'}
                  bg={'white'}
                  as={MdSave}
                  padding={'4px'}
                  ml={'5px'}
                ></Icon>
              </Text>
              <Text mt={'5px'}>
                Bearbeiten Sie eine eingeloggte Auswahl erneut durch
                <Icon
                  ml={'5px'}
                  boxSize={'30px'}
                  borderRadius={'50%'}
                  bg={'white'}
                  as={MdEdit}
                  padding={'4px'}
                ></Icon>
              </Text>
            </Flex>

            <SimpleGrid columns={2} spacingY={0} spacingX={0} mt={'20px'}>
              {Object.keys(locations).map((locationKey, index) => {
                return (
                  <Flex
                    key={index}
                    justifyContent={'center'}
                    alignItems={'center'}
                    height={'200px'}
                    // height={
                    //   lockedSliderState.every((element) => element > 0)
                    //     ? undefined
                    //     : '200px'
                    // }
                    padding={'10px'}
                    // borderTop={
                    //   [2, 3, 4].includes(index) ? '1px solid black' : undefined
                    // }
                  >
                    <InfoCard
                      locationKey={locationKey}
                      sliderValueList={sliderValueList}
                      setSliderValueList={setSliderValueList}
                      lockedSliderState={lockedSliderState}
                      lockState={lockState}
                      unlockState={unlockState}
                    ></InfoCard>
                  </Flex>
                )
              })}
              <Flex
                justifyContent={'center'}
                alignItems={'center'}
                height={'200px'}
                padding={'10px'}
                // borderTop={'1px solid black'}
              >
                {lockedSliderState.every((element) => element > 0) ? (
                  <DonationButton />
                ) : (
                  <></>
                )}
              </Flex>
            </SimpleGrid>
            <Text mt={'10px'}>
              Sobald die Privatsphäre-Niveaus für alle Orte ausgewählt sind,
              können Sie Ihre Mobilitätsdaten mit den gewählten
              Privatsphäre-Niveaus spenden.
            </Text>
          </Flex>
          {/* <InstructionModal
            instructionIsOpen={instructionIsOpen}
            instructionOnClose={handleInstructionOnClose}
            instructionOnOpen={handleInstructionOnOpen}
            trackEvent={trackEvent}
          >
            <Box>
              1. Verschieben Sie den Regler auf das gewünschte Privacy Level
            </Box>
            <Flex>
              2. Bestätigen Sie die Auswahl mit{' '}
              <Icon
                as={MdSave}
                boxSize={'30px'}
                ml={'10px'}
                // border={'2px solid black'}
                borderRadius={'4px'}
                padding={'4px'}
                // bg={'green.200'}
              ></Icon>
            </Flex>
          </InstructionModal> */}
        </Flex>
      )}

      <HelpModal />
    </Track>
  )
}
export default BasePage
