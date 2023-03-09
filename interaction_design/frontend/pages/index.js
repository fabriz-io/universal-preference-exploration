import { log_interaction, get_conditon } from '../utils/apiCalls'
import { useEffect, useState } from 'react'
import { useTracking } from 'react-tracking'
import { v4 as uuidv4 } from 'uuid'

import { Box, Flex, Input, Text } from '@chakra-ui/react'
import NavigationButton from '../components/NavigationButton'
import Cookies from 'js-cookie'

const StartPage = () => {
  const [userID, setUserID] = useState(undefined)
  const [condition, setCondition] = useState(undefined)
  const [prolificID, setProlificID] = useState('')
  const [logMessage, setLogMessage] = useState(undefined)
  const { Track, trackEvent } = useTracking(
    { component: 'index.js', datetime: Date.now() },
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
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: 'landed-index-copy-id',
      })
    }
  }, [userID, trackEvent, condition, prolificID])

  useEffect(() => {
    if (userID) {
      get_conditon(userID, setCondition)
    }
  }, [userID])

  useEffect(() => {
    async function setUserCookie() {
      let cookieUserID = Cookies.get('userID')

      if (!cookieUserID) {
        cookieUserID = uuidv4() // Generate a random UUID
        Cookies.set('userID', cookieUserID, { sameSite: 'Lax' })
        setUserID(cookieUserID)
      } else {
        setUserID(cookieUserID)
      }
    }
    setUserCookie()
  }, [])

  const handleProlificIDCopy = (event) => {
    Cookies.set('prolificID', event.target.value, { sameSite: 'Lax' })
    setProlificID(event.target.value)
  }

  return (
    <Track>
      <Flex
        justifyContent={'center'}
        alignItems={'flex-start'}
        width={'100vw'}
        height={'100vh'}
        padding={'100px'}
      >
        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'20'}
        >
          <Box>
            <Text mb="8px">Bitte fügen Sie hier ihre ProlificID ein:</Text>
            <Input
              value={prolificID}
              onChange={handleProlificIDCopy}
              placeholder="ProlificID"
            ></Input>
          </Box>
          <NavigationButton
            href={'welcome'}
            buttonText={'Start'}
            isDisabled={prolificID ? false : true}
          ></NavigationButton>
        </Flex>
      </Flex>
    </Track>
  )
}

export default StartPage
