import { useState } from 'react'
import { metersPerSliderStep, amountSliderSteps } from '../utils/constants'
import { getHoveredBackgroundColor } from '../utils/functions'

import { Box, Divider, Icon, Center, Flex } from '@chakra-ui/react'
import { MdSave } from 'react-icons/md'

const maxBarHeight = '400px'

export default function InfoCardBayesian({
  locationKey,
  handleInfoBoxClickLeft,
  handleInfoBoxClickRight,
  lockedSliderState,
  sliderValueList1,
  sliderValueList2,
  lockState,
  hoveredSide,
  setHoveredSide,
}) {
  const [preferenceClickIsEnabled, setPreferenceClickIsEnabled] = useState(true)

  return (
    <>
      {lockedSliderState[locationKey] == -1 ? (
        <>
          <Flex flexDirection={'column'} zIndex={50}>
            <Box
              bg={'gray.500'}
              padding={'2px'}
              width={'100%'}
              color={'white'}
              fontSize={'15px'}
              opacity={'0.8'}
            >
              <Center>Hohes Privatssphäre-Niveau</Center>
            </Box>

            <Flex
              position={'relative'}
              height={'420px'}
              justifyContent={'space-between'}
              alignItems={'flex-end'}
            >
              <Divider
                position={'absolute'}
                left={'50%'}
                orientation={'vertical'}
              />
              {[sliderValueList1, sliderValueList2].map((sliderList, index) => {
                return (
                  <Box
                    key={index}
                    position={'relative'}
                    height={maxBarHeight}
                    width={'50%'}
                    color={'white'}
                    _hover={{ cursor: 'pointer' }}
                    onMouseOver={
                      index === 0
                        ? () => setHoveredSide(0)
                        : () => setHoveredSide(1)
                    }
                    onMouseOut={() => setHoveredSide(-1)}
                    onClick={
                      preferenceClickIsEnabled
                        ? index === 0
                          ? () => handleInfoBoxClickLeft(locationKey)
                          : () => handleInfoBoxClickRight(locationKey)
                        : undefined
                    }
                  >
                    <Flex
                      flexDirection={'column'}
                      justifyContent={'flex-end'}
                      alignItems={'center'}
                      height={'100%'}
                    >
                      <Flex
                        zIndex={100}
                        bg={
                          index == 0
                            ? getHoveredBackgroundColor(hoveredSide, 'left')
                            : getHoveredBackgroundColor(hoveredSide, 'right')
                        }
                        width={'90%'}
                        borderWidth={'2px'}
                        borderStyle={'solid'}
                        borderColor={'white'}
                        minH={'34px'}
                        height={`${
                          (100 * sliderList[locationKey]) / amountSliderSteps
                        }%`}
                        justifyContent={'center'}
                        alignItems={'center'}
                        position={'relative'}
                      >
                        <Flex
                          width={'50%'}
                          justifyContent={'flex-start'}
                          alignItems={'center'}
                          gap={'2'}
                        >
                          {sliderList[locationKey] * metersPerSliderStep}m
                        </Flex>
                        {hoveredSide == index && (
                          <Icon
                            position={'absolute'}
                            right={'1'}
                            bottom={'1'}
                            as={MdSave}
                            zIndex={100}
                            bg={'white'}
                            boxSize={'24px'}
                            border={'1px solid black'}
                            borderRadius={'6px'}
                            color={'black'}
                            padding={'2px'}
                            _hover={{
                              bg: 'blue.500',
                              cursor: 'pointer',
                            }}
                            onMouseOut={() => {
                              setPreferenceClickIsEnabled(true)
                            }}
                            onMouseOver={() => {
                              setPreferenceClickIsEnabled(false)
                            }}
                            onClick={() => {
                              lockState(
                                locationKey,
                                Number(sliderList[locationKey]),
                              )
                            }}
                          ></Icon>
                        )}
                      </Flex>
                    </Flex>
                  </Box>
                )
              })}
            </Flex>

            <Box
              bg={'gray.500'}
              padding={'2px'}
              width={'100%'}
              color={'white'}
              fontSize={'15px'}
              opacity={'0.8'}
            >
              <Center>Niedriges Privatssphäre-Niveau</Center>
            </Box>
          </Flex>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
