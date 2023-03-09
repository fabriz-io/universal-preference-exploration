import HelpModal from '../../components/HelpModal'

import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'
import { arraysAreEqual } from '../../utils/functions'

import {
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Radio,
  ModalCloseButton,
  Center,
  Button,
  Link,
  RadioGroup,
  Flex,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react'
import NavigationButton from '../../components/NavigationButton'

{
  /* Wofür sollen die gesammelten Daten unter anderem genutzt werden? */
}

// const questions = [
//   'Mobilitäsdaten können verschiedene Formen annehmen. Welche Art von Mobilitätsdaten werden in der Kampagne der SVG erhoben?',
//   'Als Anonyimiserungstechnik wird Differential Privacy verwendet. Welche Aussage stimmt in Bezug auf GPS Koordinaten?',
//   'Wofür sollen die gesammelten Daten unter anderem genutzt werden?',
// ]
// const answers = [
//   [
//     'GPS Koordinaten eines besuchten Ortes',
//     'Uhrzeit eines besuchten Ortes',
//     'Gefahrene Strecke zwischen zwei besuchten Orten',
//   ],
//   [
//     'Je größer der Radius, desto größer das Privacy Level',
//     'Je größer der Radius, desto kleiner das Privacy Level',
//     'Die Größe des Radius hat keinen Einfluss auf das Privacy Level',
//   ],
//   [
//     'Um das Konzept einer "Smart City" im öffentlichen Nahverkehr zu testen',
//     'Um das vielfältige Carsharing Angebot der Stadt zu koordinieren',
//     'Um Auslastungsspitzen im öffentlichen Nahverkehr besser vorherzusagen',
//   ],
// ]

const component_name = 'ac1'
// const correctAnswers = ['1', '1', '3']

const AttentionCheck1 = () => {
  const [freeText, setFreeText] = useState(undefined)
  const [answersAreCorrect, setAnswersAreCorrect] = useState()
  const [wrongTries, setWrongTries] = useState(0)
  const {
    isOpen: instructionIsOpen,
    onOpen: instructionOnOpen,
    onClose: instructionOnClose,
  } = useDisclosure()

  const handleInstructionOnOpen = () => {
    setWrongTries(wrongTries + 1)
    instructionOnOpen()
  }

  const { Track, trackEvent } = useTracking(
    { component: component_name, datetime: Date.now() },
    { dispatch: (data) => setLogMessage(data) },
  )
  const [userID, setUserID] = useState(undefined)
  const [condition, setCondition] = useState(undefined)
  const [prolificID, setProlificID] = useState(undefined)
  const [logMessage, setLogMessage] = useState(undefined)

  useEffect(() => {
    if (logMessage) {
      log_interaction(logMessage)
    }
  }, [logMessage])

  useEffect(() => {
    if (userID && condition && prolificID) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: `landed-${component_name}`,
      })
    }
  }, [userID, trackEvent, condition, prolificID])

  useEffect(() => {
    if (freeText) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: `freetext-${component_name}`,
        freetext: freeText,
      })
    }
  }, [userID, trackEvent, condition, prolificID, freeText])

  useEffect(() => {
    const cookieUserID = Cookies.get('userID')
    const cookieCondition = Cookies.get('condition')
    const cookieProlificID = Cookies.get('prolificID')

    setUserID(cookieUserID)
    setCondition(cookieCondition)
    setProlificID(cookieProlificID)
  }, [])

  // ______________________________________________________________________
  // ______________________________________________________________________
  // ______________________________________________________________________
  // ______________________________________________________________________

  // const [answersArray, setAnswersArray] = useState(
  //   questions.map(() => undefined),
  // )

  const [finalAnswers, setFinalAnswers] = useState(undefined)

  // useEffect(() => {
  //   if (answersArray.every((a) => a)) {
  //     setFinalAnswers(answersArray)
  //   }
  // }, [answersArray])

  // useEffect(() => {
  //   if (finalAnswers) {
  //     trackEvent({
  //       userid: userID,
  //       condition: condition,
  //       event: 'final-answers-ac1',
  //       answers: finalAnswers,
  //     })
  //   }
  // }, [finalAnswers, trackEvent, condition, userID])

  // useEffect(() => {
  //   if (finalAnswers) {
  //     const correct = arraysAreEqual(finalAnswers, correctAnswers)
  //     setAnswersAreCorrect(correct)
  //   }
  // }, [finalAnswers])

  // useEffect(() => {
  //   if (wrongTries > 0) {
  //     trackEvent({
  //       userid: userID,
  //       condition: condition,
  //       event: 'wrongtrie',
  //       noOfTrie: wrongTries,
  //     })
  //   }
  // }, [wrongTries])

  const handleRadioClicked = (value, answerIndex) => {
    const newAnswersArray = answersArray.map((a, index) => {
      if (answerIndex == index) {
        return value
      } else {
        return a
      }
    })

    setAnswersArray(newAnswersArray)
  }

  const handleInstructionClose = () => {
    trackEvent({
      userid: userID,
      event: 'instruction-close',
    }),
      instructionOnClose()
  }

  return (
    <Track>
      <Flex justifyContent={'center'}>
        <Flex
          // bg={'yellow.200'}
          margin={'50px'}
          gap={20}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'space-around'}
        >
          {/* {questions.map((q, index) => {
            return (
              <RadioGroup
                key={index}
                value={answersArray[index]}
                onChange={(value) => handleRadioClicked(value, index)}
                defaultChecked={false}
                // bg={'green.200'}
                width={'600px'}
                fontSize={'xl'}
              >
                <Flex
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  gap={5}
                >
                  <Text>{q}</Text>
                  <Flex gap={5} flexDirection="column">
                    {answers[index].map((a, index) => (
                      <Radio key={index} value={`${index + 1}`}>
                        {a}
                      </Radio>
                    ))}
                  </Flex>
                </Flex>
              </RadioGroup>
            )
          })} */}

          <Box width={'50%'}>
            {
              'Nennen Sie einen Ort, von dem Sie denken würden, dass viele Leute ihn als "Persönlichen Ort" im Sinne der Erklärung auf der letzten Seite einordnen:'
            }
            <Textarea
              isRequired={true}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder=""
            />
          </Box>

          <Flex justifyContent={'center'} width={'100%'} gap={'10'}>
            <NavigationButton href={'s1'} buttonText={'zurück'} />
            {true ? (
              <NavigationButton
                href={'s2'}
                buttonText={'weiter'}
                isDisabled={freeText ? false : true}
              ></NavigationButton>
            ) : (
              <Button
                bg={'white'}
                border={'2px solid black'}
                padding={'20px'}
                _hover={{ bg: 'blue.400' }}
                isDisabled={freeText ? false : true}
                onClick={handleInstructionOnOpen}
              >
                {'weiter'}
              </Button>
            )}
          </Flex>
          {/* <Button
            onClick={() =>
              // console.log(answersAreCorrect, finalAnswers, wrongTries)
            }
          >
            Test
          </Button> */}
        </Flex>
      </Flex>

      <Modal
        isOpen={instructionIsOpen}
        onClose={handleInstructionClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody
            // maxW={'900px'}
            //  height={'500px'}
            width={'500px'}
            padding={'80px'}
          >
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              flexDirection={'column'}
              gap={5}
            >
              <Box maxW={'100% '}>
                Leider waren nicht alle Antworten richtig.
              </Box>
              <Box maxW={'100% '}>
                Bitte lesen Sie noch einmal die Erklärungen und beantworten die
                Fragen anschließend erneut.
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={'white'}
              border={'2px solid black'}
              padding={'20px'}
              _hover={{ bg: 'blue.400' }}
              onClick={instructionOnClose}
            >
              {'OK'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <HelpModal />
    </Track>
  )
}

export default AttentionCheck1
