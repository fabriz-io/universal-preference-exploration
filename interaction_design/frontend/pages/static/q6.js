import HelpModal from '../../components/HelpModal'
import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'
import { shuffleArray } from '../../utils/functions'

import NavigationButton from '../../components/NavigationButton'
import Questionnaire from '../../components/Questionnaire'

import { Center, Box, Flex, Textarea, Text } from '@chakra-ui/react'

const component_name = 'q6'

const TextareaInterface = () => {
  const [feedbackIsSent, setFeedbackIsSent] = useState(false)

  const [textValue, setTextValue] = useState('')
  const [userID, setUserID] = useState(undefined)
  const [condition, setCondition] = useState(undefined)
  const [prolificID, setProlificID] = useState(undefined)
  const [logMessage, setLogMessage] = useState(undefined)
  const { Track, trackEvent } = useTracking(
    {
      component: component_name,
      datetime: Date.now(),
      userid: userID,
      condition: condition,
      prolificid: prolificID,
    },
    { dispatch: (data) => setLogMessage(data) },
  )

  useEffect(() => {
    if (logMessage) {
      log_interaction(logMessage)
    }
  }, [logMessage])

  useEffect(() => {
    if (userID && condition && prolificID) {
      trackEvent({
        event: `landed-${component_name}`,
      })
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [userID, trackEvent, condition, prolificID])

  useEffect(() => {
    const cookieUserID = Cookies.get('userID')
    const cookieCondition = Cookies.get('condition')
    const cookieProlificID = Cookies.get('prolificID')

    setUserID(cookieUserID)
    setCondition(cookieCondition)
    setProlificID(cookieProlificID)
  }, [])

  const handleFeedbackChange = (text) => {
    setTextValue(text)
    trackEvent({
      event: 'end-textarea-submit',
      text: text,
    })
  }

  return (
    <Track>
      {' '}
      <Flex
        justifyContent={'center'}
        width={'100vw'}
        flexDirection={'column'}
        alignItems={'center'}
      >
        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          width={'600px'}
          mt={'50px'}
          fontSize={'2xl'}
          // justifyContent={'space-around'}
        >
          <Text>
            Sind Ihnen beim Nutzen der Bedienoberfläche weitere Gedanken durch
            den Kopf gegangen?
          </Text>
          <Textarea
            mt={'10px'}
            height={'100px'}
            value={textValue}
            onChange={(e) => handleFeedbackChange(e.target.value)}
            placeholder="Feedback"
          />
          <Flex
            mt={'100px'}
            mb={'100px'}
            justifyContent={'center'}
            width={'100%'}
          >
            <NavigationButton
              href={'q4'}
              buttonText={'weiter'}
              isDisabled={textValue ? false : true}
            ></NavigationButton>
          </Flex>
        </Flex>
      </Flex>
    </Track>
  )
}

export default TextareaInterface
