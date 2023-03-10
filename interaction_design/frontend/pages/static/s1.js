import HelpModal from '../../components/HelpModal'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Text,
  Link,
  Center,
  Input,
  Box,
  Image,
} from '@chakra-ui/react'
import NavigationButton from '../../components/NavigationButton'
import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'

const component_name = 's1'

const rejectionLink = 'https://app.prolific.co/submissions/complete?cc=C10HV7V9'

const ScenarioPage = () => {
  const [freeText, setFreeText] = useState('')
  const [failedACCount, setFailedACCount] = useState(undefined)
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
    if (userID && condition && prolificID && failedACCount) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: `landed-${component_name}`,
      })
    }

    if (failedACCount >= 2) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: `warning-ac-failed`,
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
    setFailedACCount(cookieFailedACCount)
  }, [])

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

  return (
    <Track>
      {failedACCount !== '2' ? (
        <>
          <Flex
            w={'100vw'}
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
            paddingBottom={'250px'}
          >
            <Flex
              // bg={'blue.200'}
              // height={'100%'}
              flexDirection={'column'}
              alignItems={'flex-start'}
              w={'800px'}
              gap={10}
              fontSize={'xl'}
              paddingTop={'40px'}
              paddingBottom={'40px'}
            >
              <Box onClick={() => console.log(userID)} fontSize={'4xl'}>
                Stellen Sie sich folgende Situation vor:
              </Box>

              <Box>
                Die st??dtische Verkehrsgemeinschaft <Text as={'b'}>(SVG)</Text>{' '}
                stellt das Angebot des ??ffentlichen Nahverkehrs in Berlin
                bereit. In der Vergangenheit kam es aufgrund ??berf??llter Busse
                und Bahnen, vielen Versp??tungen oder gar Ausf??llen oft zu
                Frustrationen bei Fahrg??sten. Daher m??chte die SVG neue Bus- und
                Bahnverbindungen effektiv an den Stellen einsetzen, wo die
                gr????te Entlastung f??r das Streckennetz zu erwarten ist. Um diese
                Verbesserungen umzusetzen, sollen Mobilit??tsdaten von
                Nutzer:innen analysiert und Auslastungsspitzen vorhergesagt
                werden.
              </Box>
              {/* <Box>
            Aus diesem Grund plant die SVG eine ??ffentliche Kampagne, in der
            Nutzer:innen der SVG zum Spenden ihrer Mobilit??tsdaten aufgerufen
            werden.
          </Box> */}

              <Box>
                {
                  'Stellen Sie sich nun vor, Sie wohnen und arbeiten in Berlin und nutzen t??glich die ??ffentlichen Verkehrsmittel der SVG. Gelegentlich sind Sie von ausfallenden und zu sp??t kommenden Bussen und Bahnen genervt und daher grunds??tzlich an einer Verbesserung des Streckennetzes interessiert.'
                }
              </Box>
            </Flex>
            <Flex
              // bg={'blue.200'}
              // height={'100%'}
              flexDirection={'column'}
              alignItems={'center'}
              w={'800px'}
              gap={10}
              fontSize={'xl'}
              paddingTop={'40px'}
              paddingBottom={'40px'}
            >
              <Box>
                <Box fontSize={'2xl'}>Ihre am H??ufigsten besuchten Orte:</Box>

                <Box width={'1000px'} mt={'10px'}>
                  <Image
                    // borderTop={'2px solid rgb(94, 163, 238)'}
                    // borderBottom={'2px solid rgb(94, 163, 238)'}
                    // center={'center'}
                    fit={'cover'}
                    bg={'rgb(111, 111, 111)'}
                    src="../user_route.png"
                    alt="User Route"
                  />
                </Box>
              </Box>

              <Text>
                Stellen Sie sich f??r den pers??nlichen Ort einen Ort vor, der f??r
                Sie sehr privat ist und den Sie nicht mit jeder Person teilen
                w??rden.
              </Text>

              <Box>
                {
                  'Nennen Sie einen Ort, von dem Sie denken, dass viele Leute ihn als "Pers??nlichen Ort" im Sinne dieser Erkl??rung einordnen w??rden:'
                }
                <Input
                  mt={'20px'}
                  isRequired={true}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder=""
                  border={'1px solid blue'}
                />
              </Box>
              <Box>
                Auf der n??chsten Seite zeigen wir Ihnen den Flyer der SVG mit
                weiteren Informationen.
              </Box>

              <Center width={'100%'}>
                <NavigationButton
                  href={'s2'}
                  buttonText={'weiter'}
                  isDisabled={!freeText}
                ></NavigationButton>
              </Center>
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Sie haben zwei Aufmerksamkeitstests nicht bestanden. Eine
              Fortsetzung der Studie ist dadurch leider nicht mehr m??glich.
            </AlertTitle>
            <AlertDescription marginTop={'20px'}> </AlertDescription>
          </Alert>
          <Center fontSize={'2xl'} margin={'20px'} width={'100%'}>
            Zur??ck zu Prolific:
            <Link
              href={rejectionLink}
              // bg={'gray.200'}
              fontSize={'3xl'}
              padding={'20px'}
              margin={'10px'}
              color={'blue.500'}
              // borderRadius={'10%'}
            >
              {rejectionLink}
            </Link>
          </Center>
        </>
      )}

      <HelpModal />
    </Track>
  )
}

export default ScenarioPage
