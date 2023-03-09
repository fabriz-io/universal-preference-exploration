import {
  locations,
  amountSliderSteps,
  heatMapColorGradient,
  sliderMarkColor,
  metersPerSliderStep,
} from '../utils/constants'
import { linspace } from '../utils/functions'

import {
  Box,
  Stack,
  Radio,
  Icon,
  RadioGroup,
  Button,
  Center,
  Circle as ChakraCircle,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Flex,
  Text,
  SimpleGrid,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
} from '@chakra-ui/react'

const PrivacySlider = ({
  locationKey,
  sliderValueList,
  setSliderValueList,
  width,
  lockedSliderState,
}) => {
  const handleSliderChange = (newSliderValue, locationKey) => {
    const newSliderValueList = sliderValueList.map((sliderValue, index) => {
      if (index == locationKey) {
        return newSliderValue
      } else {
        return sliderValue
      }
    })

    setSliderValueList(newSliderValueList)
  }

  return (
    <Center
      minWidth={'250px'}
      height={'120px'}
      width={'270px'}
      // bg={'green'}
      // height
      // border={'2px solid purple'}
      // paddingTop={'20px'}
      paddingLeft={'40px'}
      paddingRight={'20px'}
      // paddingBottom={'30px'}
      marginTop={'10px'}
      // bg={'green'}
    >
      <Slider
        position={'relative'}
        // border={'2px solid pink'}
        isReadOnly={lockedSliderState[locationKey] >= 0 ? true : false}
        height={'80%'}
        width={'80%'}
        aria-label="slider-ex-1"
        value={sliderValueList[locationKey]}
        min={1}
        max={amountSliderSteps}
        onChange={(sliderValue) => handleSliderChange(sliderValue, locationKey)}
        step={1}
      >
        <SliderTrack
          // position={'absolute'}
          // left={0}
          // bottom={'180px'}
          bg={'blackAlpha.400'}
          height={'6px'}
        >
          <SliderFilledTrack bg={'black'} />
        </SliderTrack>
        <SliderMark
          color={'white'}
          // key={index}
          value={sliderValueList[locationKey]}
          // mt="-30px"
          // border={'2px solid black'}
          // position={'absolute'}
          // top={0}
          // ml="-15px"
          // left={'-5ß'}
          position={'relative'}
        >
          <ChakraCircle
            bg={'blue.800'}
            // opacity={'0.95'}
            transform={'translate(-50%, -80%)'}
            color={'white'}
            position={'absolute'}
            zIndex={100}
            size={'50px'}
            // padding={'10px'}
            border={`2px solid orange`}
          >
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              // height={'40px'}
              // width={'40px'}
              // border={'2px solid yellow'}
              gap={'1px'}
            >
              <Box
                // border={'2px solid black'}
                fontSize={'18px'}
                height={'18px'}
                // bg={'green.200'}
              >{`${sliderValueList[locationKey] * metersPerSliderStep}`}</Box>
              <Box
                // bg={'yellow.200'}
                fontSize={'12px'}
                height={'12px'}
              >
                m
              </Box>
            </Flex>
          </ChakraCircle>
        </SliderMark>
        {linspace(1, amountSliderSteps, amountSliderSteps).map((val, index) => {
          return val % Math.round(amountSliderSteps / 5) == 0 || index == 0 ? (
            <SliderMark
              key={index}
              color={
                lockedSliderState[locationKey] == -1
                  ? val == sliderValueList[locationKey]
                    ? 'white'
                    : 'black'
                  : sliderMarkColor
              }
              value={val}
              // mt="-30px"
              // border={'2px solid black'}
              position={'absolute'}
              top={0}
              // ml="-15px"
              // left={'-5ß'}
              transform={'translate(-50%, -60%)'}
              fontSize="sm"
            >
              <ChakraCircle
                // bg={'white'}
                // color={'gray.200'}
                zIndex={100}
                // size={'40px'}
                padding={'10px'}
                border={`2px solid gray.200`}
              >
                <Flex
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  height={'30px'}
                  width={'30px'}
                  color={
                    val == sliderValueList[locationKey]
                      ? 'white'
                      : sliderMarkColor
                  }
                  // border={'2px solid yellow'}
                  gap={'1px'}
                >
                  <Box
                    // border={'2px solid black'}
                    fontSize={'15px'}
                    height={'15px'}
                  >{`${(index + 1) * metersPerSliderStep}`}</Box>
                  <Box
                    fontSize={'10px'}
                    height={'10px'}
                    // border={'2px solid black'}
                  >
                    m
                  </Box>
                </Flex>
              </ChakraCircle>
            </SliderMark>
          ) : (
            <div key={index}></div>
          )
        })}
        <SliderMark
          value={1}
          // color={cardState[locationKey] == 'unlocked' ? 'black' : 'white'}
          // position={'absolute'}
          // bottom={0}
          // left={0}
          // transform={'translate(-40%, -40%)'}
          marginTop={'75px'}
          width={'150px'}
          transform={'translate(-48%, -40%)'}
          color={sliderMarkColor}
        >
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Box fontSize={'sm'}>Niedriges</Box>
            <Box fontSize={'sm'}>Privatsphäre-Niveau</Box>
          </Flex>
        </SliderMark>
        <SliderMark
          value={amountSliderSteps}
          color={sliderMarkColor}
          // position={'absolute'}
          // bottom={0}
          // right={0}
          marginTop={'75px'}
          width={'150px'}
          transform={'translate(-50%, -40%)'}
          // border={'1px solid black'}
          // justifyContent={'center'}
        >
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Box fontSize={'sm'}>Hohes</Box>
            <Box fontSize={'sm'}>Privatsphäre-Niveau</Box>
          </Flex>
        </SliderMark>
        {/* {linspace(1, amountSliderSteps, amountSliderSteps).map((val, index) => {
          return val % Math.round(amountSliderSteps / 5) == 0 || index == 0 ? (
            <SliderMark
              key={index}
              value={val}
              position={'absolute'}
              top={'50%'}
              transform={'translate(-50%, -55%)'}
              color={'white'}
            >
              <Flex flexDir={'column'} alignItems={'left'}>
                <Box fontSize={'xl'}>|</Box>
              </Flex>
            </SliderMark>
          ) : (
            <></>
          )
        })} */}

        <SliderThumb height={'25px'} width={'10px'}></SliderThumb>
      </Slider>
    </Center>
  )
}

export default PrivacySlider
