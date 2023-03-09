import React from 'react'
import {
  Flex,
  Box,
  Input,
  Textarea,
  Link,
  Button,
  Text,
  Center,
  useClipboard,
} from '@chakra-ui/react'
import { useTracking } from 'react-tracking'
import Cookies from 'js-cookie'

import { useState, useEffect } from 'react'
import { log_interaction } from '../../utils/apiCalls'

const component_name = 'last-page'

const acceptanceLink =
  'https://app.prolific.co/submissions/complete?cc=C1KRLCLK'

const FinalPage = () => {
  const { onCopy, value, setValue, hasCopied } = useClipboard('')
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
      setValue(userID)
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

  const handleFeedbackSend = () => {
    trackEvent({
      event: 'end-textarea-submit',
      text: textValue,
    })
    setFeedbackIsSent(true)
    setTimeout(() => setFeedbackIsSent(false), 2000)
  }

  return (
    <Track>
      <Flex width={'100vw'} justifyContent={'center'}>
        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          margin={'90px'}
          gap={'20'}
          width={'50%'}
        >
          <Flex
            // marginTop={'100px'}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            <Text fontSize={'xl'}>
              Haben Sie noch weiteres Feedback zur Studie? War Ihnen
              beispielsweise etwas in dem vorgestellten Szenario unklar oder
              hatten Sie Fragen an einer anderen Stelle? Tragen Sie hier gerne
              alle weiteren Anmerkungen, Gedanken und Anregungen ein.
            </Text>
            <Textarea
              mt={'10px'}
              height={'100px'}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Weiteres Feedback"
            />
            <Center mt={'13px'} width={'100%'}>
              <Button
                bg={feedbackIsSent ? 'blue.200' : 'white'}
                border={'1px solid black'}
                padding={'20px'}
                _hover={{ bg: 'blue.400' }}
                onClick={handleFeedbackSend}
                // isDisabled={isDisabled}
              >
                {feedbackIsSent
                  ? 'Feedback erhalten. Vielen Dank!'
                  : 'Feedback absenden'}
              </Button>
            </Center>
          </Flex>
          <Box mt={'32px'}>
            <Text>
              Um die Teilnahme für Prolific zu bestätigen, klicken Sie bitte auf
              den folgenden Link:
            </Text>
            <Flex
              mt={'12px'}
              alignItems={'center'}
              gap={'15px'}
              justifyContent={'space-around'}
              bg={'gray.200'}
              padding={'20px'}
              borderRadius={'20'}
            >
              <Link
                href={acceptanceLink}
                // bg={'gray.200'}
                fontSize={'3xl'}
                padding={'20px'}
                margin={'10px'}
                color={'blue.500'}
                // borderRadius={'10%'}
              >
                {acceptanceLink}
              </Link>

              {/* <Text width={'auto'} fontSize={'20px'}>
                {'C1KRLCLK'}
              </Text>

              <Button
                bg={hasCopied ? 'blue.200' : 'white'}
                border={'2px solid black'}
                _hover={{ bg: 'blue.500' }}
                onClick={onCopy}
              >
                {hasCopied ? 'Copied!' : 'Copy'}
              </Button> */}
            </Flex>
          </Box>
          <Box fontSize={'2xl'} mt={'32px'}>
            Vielen Dank für die Teilnahme, das ist das Ende der Studie.
          </Box>
        </Flex>
      </Flex>
    </Track>
  )
}

export default FinalPage
