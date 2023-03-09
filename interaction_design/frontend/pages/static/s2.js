import HelpModal from '../../components/HelpModal'

import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'
import { arraysAreEqual } from '../../utils/functions'

import {
  Box,
  Text,
  Heading,
  Button,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  HStack,
  Center,
  Link,
  Container,
  Radio,
  RadioGroup,
  Image,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react'
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'

import NavigationButton from '../../components/NavigationButton'

const questions = [
  'Mobilitätsdaten können verschiedene Formen annehmen. Um welche Art von Mobilitätsdaten dreht es sich in dem Aufruf der SVG?',
  'Als Anonyimiserungstechnik wird Differential Privacy verwendet. Welche Aussage stimmt in Bezug auf GPS Koordinaten?',
  'Wofür sollen die gesammelten Daten unter anderem genutzt werden?',
]
const answers = [
  [
    'Name eines besuchten Ortes',
    'Gefahrene Strecke zwischen zwei besuchten Orten',
    'Koordinaten eines besuchten Ortes',
  ],
  [
    'Je größer der Radius, desto größer das Privatsphäre-Niveau',
    'Je größer der Radius, desto kleiner das Privatsphäre-Niveau',
    'Die Größe des Radius hat keinen Einfluss auf das Privatsphäre-Niveau',
  ],
  [
    'Um das Konzept einer "Smart City" im öffentlichen Nahverkehr zu testen',
    'Um das vielfältige Carsharing Angebot der Stadt zu koordinieren',
    'Um besser zu verstehen, wo und wann zusätzliche Busse und Bahnen zur Verfügung gestellt werden sollten',
  ],
]

const correctAnswers = ['3', '1', '3']
const component_name = 'ac2'

const ScenarioPage2 = () => {
  const [userID, setUserID] = useState(undefined)
  const [condition, setCondition] = useState(undefined)
  const [logMessage, setLogMessage] = useState(undefined)
  const { Track, trackEvent } = useTracking(
    { component: 's2', datetime: Date.now() },
    { dispatch: (data) => setLogMessage(data) },
  )

  useEffect(() => {
    if (logMessage) {
      log_interaction(logMessage)
    }
  }, [logMessage])

  const [prolificID, setProlificID] = useState(undefined)
  useEffect(() => {
    if (userID && condition) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: 'landed-s2',
        prolificid: prolificID,
      })
    }
  }, [userID, condition, trackEvent])

  useEffect(() => {
    const cookieUserID = Cookies.get('userID')
    const cookieCondition = Cookies.get('condition')
    const cookieProlificID = Cookies.get('prolificID')

    setProlificID(cookieProlificID)
    setUserID(cookieUserID)
    setCondition(cookieCondition)
  }, [])

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

  const [answersArray, setAnswersArray] = useState(
    questions.map(() => undefined),
  )

  const [finalAnswers, setFinalAnswers] = useState(undefined)

  useEffect(() => {
    if (answersArray.every((a) => a)) {
      setFinalAnswers(answersArray)
    }
  }, [answersArray])

  useEffect(() => {
    if (finalAnswers) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: 'final-answers-ac2',
        answers: finalAnswers,
      })
    }
  }, [finalAnswers, trackEvent, condition, userID])

  useEffect(() => {
    if (finalAnswers) {
      const correct = arraysAreEqual(finalAnswers, correctAnswers)
      setAnswersAreCorrect(correct)
    }
  }, [finalAnswers])

  useEffect(() => {
    if (wrongTries > 0) {
      trackEvent({
        userid: userID,
        prolificid: prolificID,
        condition: condition,
        event: 'wrongtrie',
        noOfTrie: wrongTries,
      })
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [wrongTries])

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
      <Flex
        // w={'100vw'}
        // h={'100vh'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        padding={'40px'}
      >
        <Flex
          w={'59.4%'}
          h={'auto'}
          // h={'84.1%'}
          padding={'70px'}
          // paddingTop={'40px'}
          // paddingBottom={'40px'}
          flexDirection={'column'}
          alignItems={'flex-start'}
          fontSize={'xl'}
          gap={14}
          bg={'rgb(236,216,80)'}
          border={'12px outset black'}
        >
          <Center width={'100%'}>
            <Heading>Die SVG bittet um Ihre Unterstützung!</Heading>
          </Center>

          <Box>
            Um unser Streckennetz zu verbessern, benötigen wir Daten über die
            Fortbewegungsströme in unserer Stadt. Mit ausreichend Daten können
            wir beispielsweise Auslastungsspitzen besser vorhersagen und dadurch
            an den richtigen Stellen zusätzliche Verkehrsmittel anbieten. Aus
            Gründen des Datenschutzes haben wir in der Vergangenheit keine
            Mobilitätsdaten gesammelt. Und auch künftig soll die Spende Ihrer
            Mobilitätsdaten freiwillig bleiben.
          </Box>
          <Box>
            Mit diesem Aufruf fragen wir Sie daher, uns Ihre Mobilitäsdaten zu
            spenden.
          </Box>
          <Box>
            Mobilitätsdaten können viele Formen annehmen. In diesem Aufruf geht
            es uns ausschließlich um die GPS Koordinaten Ihrer am häufigsten
            besuchten Orte, also beispielsweise eines öfter besuchten Cafés oder
            Ihrer Arbeitsstelle.
          </Box>
          <Box>
            Datenschutz ist uns dabei sehr wichtig. Daher werden die
            Mobilitätsdaten vor der Spende mit einem Anonymisierungsverfahren
            namens Differential Privacy anonymisiert.
          </Box>
          <Box>
            Durch den Einsatz dieses Verfahrens werden die Koordinaten besuchter
            Orte vor der Übertragung an unseren Server verändert, so dass nicht
            die tatsächlichen Koordinaten, sondern zufällige Koordinaten
            innerhalb eines bestimmten Radius übermittelt werden. Welche
            Koordinaten dies genau sind, darauf haben auch wir keinen Einfluss.
          </Box>
          <Center width={'100%'} boxShadow={'dark-lg'}>
            <Image
              // border={'2px solid black'}
              // bg={'green.200'}
              // bg={'rgb(236,216,80)'}
              fit={'cover'}
              // bg={'rgb(111, 111, 111)'}
              src="../explanation_epsilon_radius.png"
              alt="Anonyimiserungsradius"
            />
          </Center>
          <Box mt={'20px'}>
            Wichtig ist zu wissen, dass trotz des Anonymisierungsverfahrens
            immer ein Restrisiko bleibt, dass ein besuchter Ort eindeutig
            identifiziert werden kann. Wie hoch dieses Restrisiko ist, hängt
            dabei vom gewählten Privatsphäre-Niveau ab.
          </Box>
          <Flex
            // borderTop={'1px solid black'}
            // borderBottom={'1px solid black'}
            mt={'20px'}
            // paddingTop={'40px'}
            // paddingBottom={'40px'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'column'}
            gap={'3'}
          >
            <Flex
              flexDirection={'column'}
              width={'100%'}
              alignItems={'center'}
              gap={'3'}
            >
              <Flex justifyContent={'center'} gap={'55px'}>
                <Box fontSize={'xl'}>Niedrigeres Privatsphäre-Niveau</Box>
                <Box fontSize={'xl'}>Höheres Privatsphäre-Niveau</Box>
              </Flex>
              <Box boxShadow={'dark-lg'}>
                <Image
                  // w={'80%'}
                  fit={'cover'}
                  src={'../radius_comparison.png'}
                  alt="Privacy Level Comparison"
                ></Image>
              </Box>
            </Flex>
          </Flex>
          <Box>
            Grundsätzlich gilt: Je größer der gewählte Radius für die
            Anonymisierung, desto höher ist das Privatsphäre-Niveau, da eine
            Übermittlung weiter vom Ursprung entfernter Koordinaten
            wahrscheinlicher wird.
          </Box>

          <Box mt={'20px'}>
            Wir haben eine Bedienoberfläche entwickelt, mit welcher individuelle
            Privatssphäre-Niveaus für besuchte Orte festgelegt werden können. Je
            geringer das gewählte Privatsphäre-Niveau für die Spende der
            Mobilitätsdaten, desto besser können wir unseren Streckenplan
            optimieren, desto höher ist aber auch das Restrisiko, dass ein
            besuchter Ort identifiziert werden kann. Durch die Festlegung Ihres
            individuellen Privatsphäre-Niveaus entscheiden Sie selbst, in
            welchem Umfang die Koordinaten besuchter Orte anonymisiert und
            schließlich gespendet werden sollen.{' '}
          </Box>
        </Flex>

        <Box
          // bg={'green.200'}
          width={'80%'}
          height={'50px'}
          borderBottom={'1px solid black'}
        ></Box>
        <Flex
          // bg={'yellow.200'}
          margin={'50px'}
          gap={20}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'space-around'}
        >
          {questions.map((q, index) => {
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
          })}

          <Flex justifyContent={'center'} width={'100%'} gap={'10'}>
            <NavigationButton href={'s1'} buttonText={'zurück'} />
            {answersAreCorrect ? (
              <NavigationButton
                href={condition}
                buttonText={'weiter'}
                isDisabled={finalAnswers ? false : true}
              ></NavigationButton>
            ) : (
              <Button
                bg={'white'}
                border={'2px solid black'}
                padding={'20px'}
                _hover={{ bg: 'blue.400' }}
                isDisabled={finalAnswers ? false : true}
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

export default ScenarioPage2
