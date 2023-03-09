import { arraysAreEqual, linspace } from '../utils/functions'

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
} from '@chakra-ui/react'

const Questionnaire = ({
  answersArray,
  setAnswersArray,
  leftItems,
  rightItems,
  amountRadioButtons,
  countUserClicks,
  setCountUserClicks,
  leftItemsWidth,
  radioButtonsDescription = undefined,
  itemsHeight = 'auto',
  radioButtonsWidth = '110px',
  leftItemsFlexAlignment = 'flex-start',
  header = true,
}) => {
  const radioButtonValues = linspace(1, amountRadioButtons, amountRadioButtons)

  const handleRadioClicked = (value, answerIndex) => {
    const newAnswerArray = answersArray.map((a, index) => {
      if (index == answerIndex) {
        return value
      } else {
        return a
      }
    })
    setAnswersArray(newAnswerArray)
    // answerSetter(value)
    // setCountUserClicks(countUserClicks + 1)
  }

  const answerSpace = linspace(1, 7, 7)

  return (
    <div>
      <Flex flexDirection={'column'} borderBottom={'1px solid black'}>
        {header && (
          <Flex
            // bg={'pink'}
            justifyContent={'space-around'}
          >
            <Box
              width={leftItemsWidth}
              // bg={'green.200'}
            ></Box>
            {answerSpace.map((_, index) => {
              return (
                <Flex
                  key={index}
                  flexDirection={'column'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  width={radioButtonsWidth}
                  padding={'10px'}
                  // bg={'pink'}
                  borderLeft={'1px solid black'}
                  borderRight={'1px solid black'}
                  borderTop={'1px solid black'}
                  // borderRight={index == 6 ? '1px solid black' : undefined}
                >
                  {radioButtonsDescription && (
                    // <Center width={'100%'}>
                    <Text
                      align={'center'}
                      padding={'2px'}
                      // bg={'green.200'}
                      // maxW={radioButtonsWidth}
                      // padding={'10px'}
                      overflowWrap={'break-word'}
                      // bg={'green.200'}
                    >
                      {radioButtonsDescription[index]}
                    </Text>
                    // </Center>
                  )}
                  <Box>({index + 1})</Box>
                </Flex>
              )
            })}
            {rightItems && <Box width={leftItemsWidth}></Box>}
          </Flex>
        )}
        <Box border={'2px solid black'}>
          {answersArray.map((answer, index) => {
            return (
              <RadioGroup
                key={index}
                bg={index % 2 == 0 ? 'gray.200' : undefined}
                value={answer}
                // color={'white'}
                onChange={(checkedValue) =>
                  handleRadioClicked(checkedValue, index)
                }
                defaultChecked={false}
              >
                <Flex>
                  <Flex
                    // bg={'blue.400'}
                    borderRight={'1px solid black'}
                    borderBottom={'1px solid black'}
                    bg={index % 2 == 0 ? 'gray.200' : undefined}
                    padding={'10px'}
                    justifyContent={leftItemsFlexAlignment}
                    alignItems={'center'}
                    width={leftItemsWidth}
                  >
                    <Text>{leftItems[index]}</Text>
                  </Flex>

                  <Flex flexDirection="row" justifyContent={'center'}>
                    {radioButtonValues.map((val, index) => {
                      return (
                        <Box
                          key={index}
                          borderLeft={index == 0 ? undefined : '1px solid #ccc'}
                        >
                          <Radio
                            alignItems={'center'}
                            justifyContent={'center'}
                            width={radioButtonsWidth}
                            height={itemsHeight}
                            bg={'white'}
                            value={`${val}`}
                          ></Radio>
                        </Box>
                      )
                    })}
                  </Flex>
                  {rightItems && (
                    <Flex
                      bg={index % 2 == 0 ? 'gray.200' : undefined}
                      justifyContent={'flex-start'}
                      alignItems={'center'}
                      padding={'10px'}
                      width={leftItemsWidth}
                      height={itemsHeight}
                      borderLeft={'1px solid black'}
                      borderBottom={'1px solid black'}
                    >
                      <Text>{rightItems[index]}</Text>
                    </Flex>
                  )}
                </Flex>
              </RadioGroup>
            )
          })}
        </Box>
      </Flex>
    </div>
  )
}

export default Questionnaire
