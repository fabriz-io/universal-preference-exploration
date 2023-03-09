import {
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Radio,
  ModalCloseButton,
  Center,
  Button,
  Link,
  RadioGroup,
  Flex,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react'

import HelpModal from '../../components/HelpModal'
import { log_interaction } from '../../utils/apiCalls'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useTracking } from 'react-tracking'
import { linspace, shuffleArray } from '../../utils/functions'

import NavigationButton from '../../components/NavigationButton'
import Questionnaire from '../../components/Questionnaire'

const items = [
  ['behindernd', 'unterstützend'],
  ['kompliziert', 'einfach'],
  ['ineffizient', 'effizient'],
  ['verwirrend', 'übersichtlich'],
  ['langweilig', 'spannend'],
  ['uninteressant', 'interessant'],
  ['konventionell', 'originell'],
  ['herkömmlich', 'neuartig'],
]

const component_name = 'ueqs'

const UEQ = () => {
  const [textValue, setTextValue] = useState('')
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
      // const attentionCheckIndex = items.indexOf(attentionCheckItem)
      // if (finalAnswers[attentionCheckIndex] == '7') {
      //   Cookies.set('failed_ac_count', 0, { sameSite: 'Lax' })
      // } else {
      //   Cookies.set('failed_ac_count', 1, { sameSite: 'Lax' })
      // }

      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: `final-answers-${component_name}`,
        answers: finalAnswers,
        shuffledquestions: shuffledItems,
        freetext: textValue,
      })
    }
  }, [finalAnswers, condition, userID, trackEvent, shuffledItems])

  return (
    <Track>
      {shuffledItems && (
        <Flex
          justifyContent={'center'}
          width={'100vw'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          {/* <Flex
            flexDirection={'column'}
            alignItems={'center'}
            width={'600px'}
            mt={'50px'}
            fontSize={'2xl'}
            // justifyContent={'space-around'}
          >
            <Text>
              Was ist Ihnen beim Nutzen der Bedienoberfläche durch den Kopf
              gegangen?
            </Text>
            <Textarea
              mt={'10px'}
              height={'100px'}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Feedback"
            />
          </Flex> */}
          <Flex
            width={'800px'}
            marginTop={'20px'}
            // gap={5}
            flexDirection={'column'}
            alignItems={'flex-start'}
            justifyContent={'space-around'}
            gap={'5'}
          >
            <Box
              // mt={'100px'}
              // width={'80%'}
              borderBottom={'1px solid black'}
            ></Box>
            <Box>
              {
                'Bitte geben Sie nun Ihre Beurteilung für die Bedienoberfläche ab. '
              }
            </Box>
            <Box>
              Der nachfolgende Fragebogen besteht aus Gegensatzpaaren von
              Eigenschaften, die die Bedienoberfläche haben kann. Abstufungen
              zwischen den Gegensätzen sind durch Kreise dargestellt. Durch
              Ankreuzen eines dieser Kreise können Sie Ihre Zustimmung zu einem
              Begriff äußern.
            </Box>
            <Box>
              Beispiel:
              <RadioGroup
                mt={'10px'}
                bg={'gray.200'}
                value={'5'}
                // height={'60px'}
                border={'1px solid black'}
              >
                <Flex flexDirection={'row'} alignItems={'center'}>
                  <Flex
                    // bg={'gray.200'}
                    padding={'10px'}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    width={'140px'}
                    height={'60px'}
                    borderRight={'1px solid black'}
                  >
                    <Text>{'uninteressant'}</Text>
                  </Flex>
                  <Flex flexDirection="row" justifyContent={'center'}>
                    {linspace(1, 7, 7).map((val, index) => {
                      return (
                        <Box key={index} border={'1px solid #ccc'}>
                          <Radio
                            width={'60px'}
                            height={'60px'}
                            bg={'white'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            value={`${val}`}
                          ></Radio>
                        </Box>
                      )
                    })}
                  </Flex>

                  <Flex
                    bg={'gray.200'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    padding={'10px'}
                    width={'140px'}
                    height={'60px'}
                    borderLeft={'1px solid black'}

                    // height={'100%'}
                  >
                    <Text>{'interessant'}</Text>
                  </Flex>
                </Flex>
              </RadioGroup>
            </Box>

            <Box as={'b'}>
              Mit dieser Beurteilung sagen Sie aus, dass Sie die
              Bedienoberfläche eher interessant als uninteressant einschätzen.
            </Box>
            <Box>
              Entscheiden Sie möglichst spontan. Es ist wichtig, dass Sie nicht
              lange über die Begriffe nachdenken, damit Ihre unmittelbare
              Einschätzung zum Tragen kommt. Bitte kreuzen Sie immer eine
              Antwort an, auch wenn Sie bei der Einschätzung zu einem
              Begriffspaar unsicher sind oder finden, dass es nicht so gut zu
              der Bedienoberfläche passt. Es gibt keine „richtige“ oder
              „falsche“ Antwort. Ihre persönliche Meinung zählt!
            </Box>
            <Questionnaire
              header={false}
              answersArray={answersArray}
              setAnswersArray={setAnswersArray}
              leftItems={shuffledItems.map((elem) => elem[0])}
              rightItems={shuffledItems.map((elem) => elem[1])}
              amountRadioButtons={7}
              leftItemsWidth={'150px'}
              itemsHeight={'60px'}
              radioButtonsWidth={'80px'}
              leftItemsFlexAlignment={'flex-end'}
              // radioButtonsDescription={radioButtonsDescription}
            ></Questionnaire>

            <Flex
              mt={'100px'}
              mb={'100px'}
              justifyContent={'center'}
              width={'100%'}
            >
              <NavigationButton
                href={'q6'}
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

export default UEQ
