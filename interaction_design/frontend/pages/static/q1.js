import HelpModal from '../../components/HelpModal'
import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'
import { shuffleArray, arraysAreEqual, linspace } from '../../utils/functions'

import { Text, Box, Modal, Center, Button, Link, Flex } from '@chakra-ui/react'
import NavigationButton from '../../components/NavigationButton'
import Questionnaire from '../../components/Questionnaire'

// const items = [
//   'Unternehmen sollten persönliche Informationen nicht zu anderen Zwecken verwenden, sofern diesem nicht seitens der Einzelpersonen, die die Informationen bereitgestellt haben, zugestimmt wurde.',
//   'Wenn Personen aus irgendeinem Grund persönliche Informationen an ein Unternehmen weitergeben, sollte das Unternehmen diese Informationen niemals zu anderen Zwecken verwenden.',
//   'Unternehmen sollten die in ihren Computerdatenbanken hinterlegten persönlichen Daten niemals an andere Unternehmen verkaufen.',
//   'Unternehmen sollten persönliche Informationen niemals an andere Unternehmen weitergeben, sofern diesem nicht seitens der Einzelpersonen, die die Informationen bereitgestellt haben, zugestimmt wurde.',
//   'Unternehmen sollten mehr Zeit und Bemühungen investieren, um unautorisiertem Zugriff auf persönliche Daten vorzubeugen.',
//   'Computerdatenbanken, die persönliche Informationen enthalten, sollten ungeachtet der dafür entstehenden Kosten vor unautorisiertem Zugriff geschützt werden.',
//   'Unternehmen sollten mehr Schritte unternehmen, um sicherzustellen, dass unautorisierte Personen nicht auf persönliche Informationen auf ihren Computern zugreifen können.',
// ]

const attentionCheckItem =
  'Damit wir wissen, dass Sie die Fragen gelesen haben, wählen sie bitte die Antwortmöglichkeit "Stimme eher zu" aus. Dies ist ein Aufmerksamkeitstests.'

const correctAnswerIndex = '5'

const items = [
  'Beim Online-Datenschutz für Verbraucher:innen geht es in erster Linie um das Recht der Verbraucher:innen, Kontrolle und Autonomie über Entscheidungen auszuüben, wie persönliche Informationen gesammelt, verwendet und weitergegeben werden.',
  'Die Kontrolle der Verbraucher:innen über ihre persönlichen Informationen ist die Kernaufgabe des Datenschutzes.',
  'Ich glaube, dass die Online-Privatsphäre durch eine Marketingmaßnahme verletzt wird, wenn Kontrolle verloren geht oder ungewollt reduziert wird.',
  'Unternehmen, die Online Informationen einholen, sollten offenlegen, wie die Daten gesammelt, verarbeitet und genutzt werden.',
  'Eine gute Online-Datenschutzrichtlinie für Verbraucher:innen sollte  klar formuliert und auffällig platziert sein.',
  'Es ist mir sehr wichtig, dass ich bewusst und sachkundig darüber informiert bin, wie meine persönlichen Informationen verwendet werden.',
  'Normalerweise stört es mich, wenn Online-Unternehmen mich nach persönlichen Informationen fragen.',
  'Wenn mich Online-Unternehmen nach persönlichen Informationen fragen, überlege ich manchmal zweimal, bevor ich sie angebe.',
  'Es stört mich, so vielen Online-Unternehmen persönliche Informationen zu geben.',
  'Ich bin besorgt, dass Online-Unternehmen zu viele persönliche Informationen über mich sammeln.',
  attentionCheckItem,
]

const radioButtonsDescription = [
  'Stimme überhaupt nicht zu',
  'Stimme nicht zu',
  'Stimme eher nicht zu',
  'Un- entschlossen',
  'Stimme eher zu',
  'Stimme zu',
  'Stimme voll und ganz zu',
]

const component_name = 'iuipc'

const CFIP = () => {
  const [shuffledItems, setShuffledItems] = useState(undefined)
  const [finalAnswers, setFinalAnswers] = useState(undefined)
  const [answersArray, setAnswersArray] = useState(items.map(() => undefined))

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
    const cookieUserID = Cookies.get('userID')
    const cookieCondition = Cookies.get('condition')
    const cookieProlificID = Cookies.get('prolificID')

    setUserID(cookieUserID)
    setCondition(cookieCondition)
    setProlificID(cookieProlificID)
    setShuffledItems(shuffleArray(items))
  }, [])

  useEffect(() => {
    if (answersArray.every((item) => item)) {
      setFinalAnswers(answersArray)
    }
  }, [answersArray])

  useEffect(() => {
    if (finalAnswers) {
      const attentionCheckIndex = items.indexOf(attentionCheckItem)
      if (finalAnswers[attentionCheckIndex] == correctAnswerIndex) {
        Cookies.set('failed_ac_count', 0, { sameSite: 'Lax' })
      } else {
        Cookies.set('failed_ac_count', 1, { sameSite: 'Lax' })
      }

      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: `final-answers-${component_name}`,
        answers: finalAnswers,
        shuffledquestions: shuffledItems,
      })
    }
  }, [finalAnswers, condition, userID, trackEvent, shuffledItems])

  return (
    <Track>
      {userID && condition && shuffledItems && (
        <Flex justifyContent={'center'}>
          <Flex margin={'50px'} gap={12} flexDirection={'column'}>
            <Box fontSize={'xl'}>
              Geben Sie an, wie sehr Sie der Aussage auf der linken Seite
              zustimmen.
            </Box>
            <Questionnaire
              answersArray={answersArray}
              setAnswersArray={setAnswersArray}
              leftItems={shuffledItems}
              amountRadioButtons={7}
              leftItemsWidth={'500px'}
              // radioButtonsWidth={'110px'}
              itemsHeight={'120px'}
              radioButtonsDescription={radioButtonsDescription}
            ></Questionnaire>

            <Flex justifyContent={'flex-end'}>
              <NavigationButton
                href={'q3'}
                buttonText={'weiter'}
                isDisabled={finalAnswers ? false : true}
              ></NavigationButton>
            </Flex>
          </Flex>
        </Flex>
      )}
      <HelpModal />
    </Track>
  )
}

export default CFIP
