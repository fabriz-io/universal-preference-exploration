import HelpModal from '../../components/HelpModal'
import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'
import { shuffleArray } from '../../utils/functions'

import NavigationButton from '../../components/NavigationButton'
import Questionnaire from '../../components/Questionnaire'

import {
  Center,
  Box,
  Flex,
  Textarea,
  Text,
  Input,
  Heading,
} from '@chakra-ui/react'

const component_name = 'numeracy2'

const Numeracy = () => {
  const [answer, setAnswer] = useState('')

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
  }, [])

  useEffect(() => {
    if (answer) {
      trackEvent({
        userid: userID,
        condition: condition,
        event: `final-answer-${component_name}`,
        answer: answer,
      })
    }
  }, [answer, condition, userID, trackEvent])

  return (
    <Track>
      <Flex justifyContent={'center'} width={'100vw'} height={'100vh'}>
        <Flex
          marginTop={'70px'}
          gap={5}
          flexDirection={'column'}
          alignItems={'flex-start'}
          // justifyContent={'space-around'}
          width={'40%'}
          fontSize={'xl'}
        >
          <Text>
            {
              'Stellen Sie sich vor, Sie werfen einen fünfseitigen Würfel 50 mal.'
            }
          </Text>
          <Text>
            {
              'Bei wie vielen dieser 50 Würfe würde dieser fünfseitige Würfel erwartungsgemäß eine ungerade Zahl zeigen (1, 3 oder 5)?'
            }
          </Text>
          <Flex width={'100%'} justifyContent={'center'} gap={'5px'}>
            <Input
              width={'80px'}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              // placeholder={'Ihre Antwort'}
            ></Input>
          </Flex>

          <Flex
            mt={'100px'}
            mb={'100px'}
            justifyContent={'flex-end'}
            width={'100%'}
          >
            <NavigationButton
              href={'end'}
              buttonText={'weiter'}
              isDisabled={answer ? false : true}
            ></NavigationButton>
          </Flex>
        </Flex>
      </Flex>
      <HelpModal />
    </Track>
  )
}

export default Numeracy
