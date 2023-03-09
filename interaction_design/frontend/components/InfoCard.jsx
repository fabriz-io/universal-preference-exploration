import { MdSave, MdOutlineEdit } from 'react-icons/md'
import { locations, metersPerSliderStep } from '../utils/constants'
import PrivacySlider from './PrivacySlider'

import {
  Box,
  Icon,
  Button,
  Center,
  Circle as ChakraCircle,
  Flex,
} from '@chakra-ui/react'

const mapType = ''

const infoCardWidth = mapType != 'overview' ? '330px' : '200px'

export default function InfoCard({
  locationKey,
  sliderValueList,
  setSliderValueList,
  lockedSliderState,
  lockState,
  unlockState,
}) {
  return (
    <>
      {lockedSliderState && lockedSliderState[locationKey] == -1 ? (
        <Box width={infoCardWidth} border="2px solid black">
          <Flex flexDirection={'column'} justifyContent={'space-between'}>
            <Center
              bg={'blue.800'}
              width={'100%'}
              color={'white'}
              padding={'4px'}
              fontSize={'md'}
            >
              {locations[locationKey].description}
            </Center>

            <Flex
              bg={'blue.500'}
              height="150px"
              justifyContent={'center'}
              alignItems={'center'}
            >
              <PrivacySlider
                locationKey={locationKey}
                sliderValueList={sliderValueList}
                setSliderValueList={setSliderValueList}
                lockedSliderState={lockedSliderState}
              />

              <Button
                border={'2px solid black'}
                _hover={{
                  bg:
                    lockedSliderState[locationKey] >= 0
                      ? 'blue.500'
                      : 'blue.500',
                }}
                borderRadius={'50%'}
                width={'40px'}
                height={'40px'}
                onClick={() =>
                  lockState(locationKey, sliderValueList[locationKey])
                }
                color={'black'}
                bg={'white'}
              >
                <Icon boxSize={'20px'} as={MdSave}></Icon>
              </Button>
            </Flex>
          </Flex>
        </Box>
      ) : (
        <Box
          width={infoCardWidth}
          // height={'60px'}
          bg={'blue.800'}
          border="2px solid black"
          padding={'6px'}
        >
          <Flex justifyContent={'space-around'} alignItems={'center'}>
            <Box
              fontSize={mapType !== 'overview' ? '15px' : '2xl'}
              color={'white'}
            >
              {locations[locationKey].description}
            </Box>
            {mapType !== 'overview' && (
              <>
                <ChakraCircle
                  color={'white'}
                  zIndex={100}
                  padding={'10px'}
                  border={'2px solid orange'}
                >
                  <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    height={'30px'}
                    width={'30px'}
                    gap={'1px'}
                  >
                    <Box fontSize={'15px'} height={'15px'}>{`${
                      sliderValueList[locationKey] * metersPerSliderStep
                    }`}</Box>
                    <Box fontSize={'10px'} height={'10px'}>
                      m
                    </Box>
                  </Flex>
                </ChakraCircle>
                <Button
                  border={'2px solid black'}
                  _hover={{
                    bg:
                      lockedSliderState[locationKey] >= 0
                        ? 'blue.500'
                        : 'blue.500',
                  }}
                  borderRadius={'50%'}
                  width={'40px'}
                  height={'40px'}
                  onClick={() => unlockState(locationKey)}
                  bg={'white'}
                >
                  <Icon boxSize={'20px'} as={MdOutlineEdit}></Icon>
                </Button>
              </>
            )}
          </Flex>
        </Box>
      )}
    </>
  )
}
