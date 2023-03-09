import HelpModal from '../../components/HelpModal'
import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'
import { shuffleArray } from '../../utils/functions'

import { Text, Box, Modal, Center, Button, Link, Flex } from '@chakra-ui/react'
import NavigationButton from '../../components/NavigationButton'
import Questionnaire from '../../components/Questionnaire'

// const items = [
//   'I would prefer complex to simple problems.',
//   'I like to have the responsibility of handling a situation that requires a lot of thinking.',
//   'Thinking is not my idea of fun.',
//   'I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.',
//   'I really enjoy a task that involves coming up with new solutions to problems.',
//   'I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.',
// ]

const attentionCheckItem =
  'Damit wir wissen, dass Sie die Fragen gelesen haben, wählen sie bitte die Antwortmöglichkeit "Stimme eher nicht zu" aus. Dies ist ein Aufmerksamkeitstests.'

const correctAnswerIndex = '3'

const items = [
  'Ich würde komplizierte Probleme einfachen Problemen vorziehen.',
  'Ich trage nicht gerne die Verantwortung für eine Situation, die sehr viel Denken erfordert.',
  'Denken entspricht nicht dem, was ich unter Spaß verstehe.',
  'Ich würde lieber etwas tun, das wenig Denken erfordert, als etwas, das mit Sicherheit meine Denkfähigkeit herausfordert.',
  'Die Aufgabe, neue Lösungen für Probleme zu finden, macht mir wirklich Spaß.',
  'Ich würde lieber eine Aufgabe lösen, die Intelligenz erfordert, schwierig und bedeutend ist, als eine Aufgabe, die zwar irgendwie wichtig ist, aber nicht viel Nachdenken erfordert.',
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

const component_name = 'nfc'

const NFC = () => {
  const [failedACCount, setFailedACCount] = useState(undefined)
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
    const cookieFailedACCount = Cookies.get('failed_ac_count')

    setUserID(cookieUserID)
    setCondition(cookieCondition)
    setProlificID(cookieProlificID)
    setShuffledItems(shuffleArray(items))
    setFailedACCount(cookieFailedACCount)
  }, [])

  useEffect(() => {
    if (answersArray.every((item) => item)) {
      setFinalAnswers(answersArray)
    }
  }, [answersArray])

  useEffect(() => {
    if (finalAnswers) {
      const attentionCheckIndex = items.indexOf(attentionCheckItem)
      if (finalAnswers[attentionCheckIndex] != correctAnswerIndex) {
        if (failedACCount == 1) {
          Cookies.set('failed_ac_count', 2, { sameSite: 'Lax' })
          // console.log('rejecting submission')
        } else if (failedACCount == 0) {
          Cookies.set('failed_ac_count', 1, { sameSite: 'Lax' })
        }
      }

      trackEvent({
        userid: userID,
        condition: condition,
        event: `final-answers-${component_name}`,
        prolificid: prolificID,
        answers: finalAnswers,
        shuffledquestions: shuffledItems,
      })
    }
  }, [finalAnswers, condition, userID, trackEvent, shuffledItems])

  return (
    <Track>
      <Flex justifyContent={'center'}>
        <Flex margin={'50px'} gap={12} flexDirection={'column'}>
          <Box fontSize={'xl'}>
            Geben Sie an, wie sehr Sie der Aussage auf der linken Seite
            zustimmen.
          </Box>

          <Questionnaire
            answersArray={answersArray}
            setAnswersArray={setAnswersArray}
            leftItems={items}
            amountRadioButtons={7}
            leftItemsWidth={'500px'}
            radioButtonsWidth={'110px'}
            itemsHeight={'90px'}
            radioButtonsDescription={radioButtonsDescription}
          ></Questionnaire>

          <Flex justifyContent={'flex-end'}>
            <NavigationButton
              isDisabled={finalAnswers ? false : true}
              href={'s1'}
              buttonText={'weiter'}
            ></NavigationButton>
          </Flex>
        </Flex>
      </Flex>
      <HelpModal />
    </Track>
  )
}

export default NFC
