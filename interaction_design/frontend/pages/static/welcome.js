import {
  Box,
  Text,
  Icon,
  Button,
  Center,
  useDisclosure,
  Flex,
  Link,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Heading,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import NavigationButton from '../../components/NavigationButton'

import { useEffect, useState } from 'react'
import { useTracking } from 'react-tracking'
import { log_interaction } from '../../utils/apiCalls'
import Cookies from 'js-cookie'
import { MdSave } from 'react-icons/md'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import HelpModal from '../../components/HelpModal'

// Please read the following introduction

// The aim of this survey is to evaluate the effectiveness of privacy notifications. It consists of up to 8 pages with 22 questions in total. We expect a working time of about 15 Minutes. It collects your response to a notification scenario, as well as some background information relevant to the analysis of your answers.

// We collect no personal information except your gender. Since other studies identified influence of gender on the effectiveness of risk communication, we want to test if this is similar in our scenario. For this reason, we ask you to indicate your gender for a gender-specific analysis of the result.

// Additionally, we automatically collect your IP address and the MTurk-IDs for quality assurance. After checking the data and approving the HIT towards Amazon Mechanical Turk, we will delete this data and your answer will be processed anonymously. All data collected from you will be used exclusively for study purposes and will not be passed on to third parties.

// We record your response during your participation. If you change your mind and don't want to continue to participate in the study, you can delete your answers by clicking the Button "Exit and clear survey".

// Please do not use the browser navigation (for example the "back" button) during the survey.

// Please keep in mind that this survey aims to evaluate the effectiveness of the notification, not your performance or knowledge.

const textParts = [
  'Bitte lesen Sie alle Hinweise sorgfältig durch.',
  'Ziel dieser Studie ist es, eine neue Bedienoberfläche zum Auswählen von Privatsphäreinstellungen für Mobilitätsdaten zu testen.',
  'Ihre Aufgabe wird es sein, sich in ein Szenario zu versetzen und anschließend Privatsphäreeinstellungen in der Bedienoberfläche festzulegen. Außerdem gibt es eine Reihe von Fragebögen, die vor und nach dem Testen der Bedienoberfläche zu beantworten sind. Es sind jeweils alle Fragen zu beantworten.',
  'Es gibt Aufmerksamkeitstests. Wenn Sie mehr als eine Frage falsch beantworten, können wir Ihre Antworten nicht verwenden und müssen Sie daher leider von der Studie ausschließen.',
  'Außer Ihrer Prolific ID werden keine weiteren personenbezogenden Daten erhoben.',
  'Sollten Sie merken, dass Sie doch nicht mehr an der Studie teilnehmen möchten, können Sie jederzeit die Seite verlassen. Ihre Daten werden dann automatisch gelöscht.',
  'Bitte benutzen Sie nicht die Navigationsfunktionen des Browsers (Vorwärts, Zurück, Neu laden).',
  'Die Studie dauert ungefähr 15 Minuten.',
]

const InstructionPage = () => {
  const { Track, trackEvent } = useTracking(
    { component: 'instructions', datetime: Date.now() },
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
        event: 'landed-instructions',
      })
    }
  }, [userID, trackEvent, condition, prolificID])

  useEffect(() => {
    const cookieUserID = Cookies.get('userID')
    const cookieCondition = Cookies.get('condition')
    const cookieProlificID = Cookies.get('prolificID')

    setUserID(cookieUserID)
    setCondition(cookieCondition)
    setProlificID(cookieProlificID)
  }, [])

  return (
    <Track>
      {userID && condition && (
        <Flex
          // height={'100vh'}
          // width={'100vw'}
          justifyContent={'center'}
          padding={'20px'}
        >
          <Flex
            flexDirection={'column'}
            alignItems={'flex-start'}
            gap={'5 '}
            width={'800px'}
            // margin={'20px'}
          >
            <Flex
              fontSize={'2xl'}
              gap={2}
              alignItems={'flex-end'}
              // bg={'green.200'}
              height={'50px'}
            >
              Willkommen zur Studie{' '}
              <Text as={'b'}>Differential Privacy für Mobilitätsdaten</Text>
            </Flex>
            {textParts.map((t, index) => {
              return (
                <Box key={index} fontSize={'19px'}>
                  {t}
                </Box>
              )
            })}

            <Box fontSize={'19px'}>
              Sollten Sie Fragen oder Schwierigkeiten während des Bearbeitens
              der Studie haben, können Sie uns über das{' '}
              <Icon boxSize={'30px'} as={QuestionOutlineIcon}></Icon> Symbol am
              rechten unteren Bildschirmrand kontaktieren.
            </Box>
            <Center width={'100%'} mt={'40px'}>
              <NavigationButton
                href={'q1'}
                buttonText={'weiter'}
              ></NavigationButton>
            </Center>
          </Flex>
        </Flex>
      )}
      <HelpModal />
    </Track>
  )
}

export default InstructionPage
