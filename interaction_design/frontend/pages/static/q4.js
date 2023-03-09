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
  Link,
  Text,
  Input,
  Heading,
  Button,
} from '@chakra-ui/react'

const questions = [
  [
    'Von 1.000 Leuten in einer Kleinstadt sind 500 Mitglied im Karateverein. Von diesen 500 Mitgliedern im Karateverein sind 100 Männer. Von den 500 Einwohnern, die nicht im Karateverein sind, sind 300 Männer.',
    'Wie hoch ist die Wahrscheinlichkeit dass ein zufällig gezogener Mann Mitglied des Karatevereins ist? (bitte geben Sie die Wahrscheinlichkeit in Prozent an)',
  ],
  [
    'Stellen Sie sich vor, Sie haben einen fünfseitigen Würfel, d.h. auf jeder Seite befindet sich eine Zahl von 1 bis 5. Sie werfen diesen Würfel nun 50 mal.',
    'Wie oft würde dieser Würfel im Durchschnitt eine ungerade Zahl zeigen (1, 3 oder 5)?',
  ],
  [
    'Stellen Sie sich vor, wir werfen einen gezinkten Würfel (6 Seiten). Die Wahrscheinlichkeit, dass der Würfel eine 6 zeigt, ist doppelt so hoch wie die Wahrscheinlichkeit für jede der anderen Zahlen.',
    'Wie oft würde dieser Würfel bei diesen 70 Würfen durchschnittlich die Zahl 6 zeigen?',
  ],
  [
    'In einem Wald sind 20% der Pilze rot, 50% braun und 30% weiß. Ein roter Pilz ist giftig mit einer einer Wahrscheinlichkeit von 20%. Ein Pilz, der nicht rot ist ist mit einer Wahrscheinlichkeit von 5% giftig. Wie hoch ist die Wahrscheinlichkeit, dass ein giftiger Pilz im Wald rot ist?',
  ],
]

const correctAnswers = ['25', '30', '20', '50']

const component_name = 'numeracy'

const acceptanceLink =
  'https://app.prolific.co/submissions/complete?cc=C1KRLCLK'

const Numeracy = () => {
  const [currentQuestion, setCurrentQuestion] = useState('intro')
  const [answersArray, setAnswersArray] = useState(questions.map(() => ''))
  // const [answersArray, setAnswersArray] = useState(
  //   //     [answer1, setAnswer1] = useState('')
  //   // [answer2A, setAnswer2A] = useState('')
  //   // [answer2B, setAnswer2B] = useState('')
  //   // [answer3, setAnswer3] = useState('')
  //   questions.map(() => useState('')),
  // )

  const [finishedNumeracyQuestions, setFinishedNumeracyQuestions] = useState(
    false,
  )

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
    if (finishedNumeracyQuestions) {
      trackEvent({
        userid: userID,
        condition: condition,
        prolificid: prolificID,
        event: `final-answers-${component_name}`,
        answer: answersArray,
        currentQuestion: currentQuestion,
      })
    }
  }, [finishedNumeracyQuestions, condition, userID, trackEvent])

  // const [answer1, setAnswer1] = useState('')
  // const [answer2A, setAnswer2A] = useState('')
  // const [answer2B, setAnswer2B] = useState('')
  // const [answer3, setAnswer3] = useState('')

  const handleAnswerInserted = (currentIndex, currentAnswer) => {
    const newAnswersArray = answersArray.map((value, index) => {
      if (index == currentIndex) {
        return currentAnswer
      } else {
        return value
      }
    })

    setAnswersArray(newAnswersArray)
  }

  const handleAnswerSubmitted = (index) => {
    console.log(answersArray)
    console.log(index)
    switch (index) {
      case 0:
        if (answersArray[index] == correctAnswers[index]) {
          setCurrentQuestion(2)
        } else {
          setCurrentQuestion(1)
        }
        break
      case 1:
        setFinishedNumeracyQuestions(true)
        setCurrentQuestion('feedback')
        break
      case 2:
        console.log(answersArray[index], correctAnswers[index])
        if (answersArray[index] != correctAnswers[index]) {
          setCurrentQuestion(3)
        } else {
          setFinishedNumeracyQuestions(true)
          setCurrentQuestion('feedback')
        }
        break
      case 3:
        setFinishedNumeracyQuestions(true)
        setCurrentQuestion('feedback')
        break
    }
    // setCurrentQuestion(cu)
  }

  const [feedbackIsSent, setFeedbackIsSent] = useState(false)
  const [textValue, setTextValue] = useState('')

  const handleFeedbackSend = () => {
    trackEvent({
      userid: userID,
      prolificid: prolificID,
      event: 'textarea-general-feedback',
      text: textValue,
    })
    setFeedbackIsSent(true)
    setTimeout(() => setFeedbackIsSent(false), 2000)
  }

  return (
    <Track>
      {currentQuestion == 'intro' && (
        <>
          <Flex
            width={'100vw'}
            height={'100vh'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={'10'}
          >
            <Box fontSize={'xl'} width={'500px'}>
              Es folgen Fragen, um die Einschätzung von Personen mit
              unterschiedlicher statistischer Erfahrung zu vergleichen.
            </Box>
            <Button
              bg={'white'}
              border={'1px solid black'}
              onClick={() => setCurrentQuestion(0)}
            >
              Ok
            </Button>
          </Flex>
        </>
      )}

      {questions.map((q, index) => {
        return (
          <Box key={index}>
            {currentQuestion == index ? (
              <Flex
                key={index}
                justifyContent={'center'}
                width={'100vw'}
                height={'100vh'}
              >
                <Flex
                  marginTop={'70px'}
                  gap={5}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  // justifyContent={'space-around'}
                  width={'40%'}
                  fontSize={'xl'}
                >
                  {q.map((e, index) => (
                    <Box key={index}>{e}</Box>
                  ))}
                  <Flex width={'100%'} justifyContent={'center'} gap={'5px'}>
                    <Input
                      width={'140px'}
                      value={answersArray[index]}
                      onChange={(e) =>
                        handleAnswerInserted(index, e.target.value)
                      }
                      placeholder={'Ihre Antwort'}
                    ></Input>
                    <Box>{[0, 3].includes(index) ? '%' : ''}</Box>
                  </Flex>
                  <Flex justifyContent={'flex-end'} width={'100%'}>
                    <Button
                      bg={'white'}
                      border={'1px solid black'}
                      padding={'20px'}
                      onClick={() => handleAnswerSubmitted(index)}
                      isDisabled={!answersArray[index]}
                    >
                      Weiter
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              <></>
            )}
          </Box>
        )
      })}

      {currentQuestion == 'feedback' && (
        <Flex width={'100vw'} justifyContent={'center'}>
          <Flex
            // marginTop={'100px'}
            width={'50%'}
            flexDirection={'column'}
            alignItems={'flex-start'}
            // alignItems={'center'}
            maxWidth={'700px'}
            margin={'90px'}
            gap={'5'}
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
            {/* <Center mt={'13px'} width={'100%'}>
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
            </Center> */}
            <Flex
              justifyContent={'flex-end'}
              mt={'100px'}
              width={'100%'}
              onClick={() => setCurrentQuestion('end')}
            >
              <Button
                bg={'white'}
                border={'1px solid black'}
                padding={'20px'}
                _hover={{ bg: 'blue.400' }}
                onClick={handleFeedbackSend}
                // isDisabled={isDisabled}
              >
                Weiter
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}

      {currentQuestion == 'end' && (
        <>
          <Flex width={'100vw'} justifyContent={'center'}>
            <Flex
              flexDirection={'column'}
              alignItems={'flex-start'}
              margin={'90px'}
              gap={'20'}
              width={'50%'}
            >
              <Box fontSize={'2xl'} mt={'32px'}>
                Vielen Dank für die Teilnahme, das ist das Ende der Studie.
              </Box>

              <Box mt={'32px'}>
                <Text>
                  Um die Teilnahme für Prolific zu bestätigen, klicken Sie bitte
                  auf den folgenden Link:
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
            </Flex>
          </Flex>
        </>
      )}

      {/* <Flex mt={'100px'} mb={'100px'} justifyContent={'center'} width={'100%'}>
        <NavigationButton
          href={'q5'}
          buttonText={'weiter'}
          // isDisabled={answer ? false : true}
        ></NavigationButton>
      </Flex> */}

      <HelpModal />
    </Track>
  )
}

export default Numeracy
