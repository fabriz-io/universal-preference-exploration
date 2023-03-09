import NavigationButton from '../../components/NavigationButton'
import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Button,
  Box,
  Text,
  Textarea,
  Center,
} from '@chakra-ui/react'

const component_name = 'thanks-svg'

const ThanksPage = () => {
  const [readIntro, setReadIntro] = useState(true)
  const [textValue, setTextValue] = useState('')
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

  return (
    <Track>
      <>
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {
              'Ihre (fiktiven) Mobilitätsdaten wurden anonymisiert an die SVG übertragen'
            }
          </AlertTitle>
          <AlertDescription marginTop={'20px'} maxWidth="sm"></AlertDescription>
        </Alert>
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          marginTop={'100px'}
          flexDirection={'column'}
        >
          <Box width={'650px'} mb={'20px'}>
            Das Szenario und der Test der Bedienoberfläche sind an dieser Stelle
            abgeschlossen. Es folgen eine Reihe von Fragen zu Ihren Erfahrungen.
          </Box>
          <NavigationButton
            buttonText={'weiter'}
            href={'q2'}
          ></NavigationButton>

          {/* <Button
              mt={'20px'}
              bg={'white'}
              border={'1px solid black'}
              onClick={() => setReadIntro(false)}
            >
              Ok
            </Button> */}
        </Flex>
      </>
    </Track>
  )
}

export default ThanksPage
