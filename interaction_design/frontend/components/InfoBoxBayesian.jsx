import {
  hoveredBackgroundColor,
  metersPerSliderStep,
  locations,
} from '../utils/constants'

import { Box, Circle as ChakraCircle, Flex } from '@chakra-ui/react'

export default function InfoBoxBayesian({
  locationKey,
  sliderValueList,
  lockedSliderState,
  setCurrentLocation,
  boxIsHovered = false,
}) {
  const infoCardWidth = '150px'

  return (
    <>
      <Box
        width={infoCardWidth}
        height={'50px'}
        bg={
          lockedSliderState[locationKey] >= 1
            ? 'blue.800'
            : boxIsHovered
            ? hoveredBackgroundColor
            : 'blue.600'
        }
        border="2px solid black"
        padding={'8px'}
        _hover={{ bg: 'blue.500', cursor: 'pointer' }}
        onClick={() => setCurrentLocation(locationKey)}
      >
        <Flex
          justifyContent={'space-around'}
          alignItems={'center'}
          height={'100%'}
        >
          <Box fontSize={'15px'} color={'white'}>
            {locations[locationKey].description}
          </Box>
          <ChakraCircle
            // bg={'white'}
            color={'white'}
            zIndex={100}
            size={'35px'}
            padding={'5px'}
            // color={'white'}
            border={
              lockedSliderState[locationKey] >= 1
                ? '2px solid orange'
                : '1px solid gray'
            }
          >
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box fontSize={'14px'} height={'14px'}>
                {lockedSliderState[locationKey] >= 1
                  ? lockedSliderState[locationKey] * metersPerSliderStep
                  : sliderValueList[locationKey] * metersPerSliderStep}
              </Box>
              <Box fontSize={'9px'} height={'9px'}>
                m
              </Box>
            </Flex>
          </ChakraCircle>
        </Flex>
      </Box>
    </>
  )
}
