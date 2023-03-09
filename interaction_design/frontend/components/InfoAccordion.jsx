import InfoCardBayesian from './InfoCardBayesian'
import { MdEdit } from 'react-icons/md'
import { LockIcon } from '@chakra-ui/icons'
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Button,
  Circle as ChakraCircle,
  Flex,
} from '@chakra-ui/react'

import {
  locations,
  lockedAccordionButtonBG,
  unlockedAccordionButtonBG,
  lockedAccordionPanelBG,
  unlockedAccordionPanelBG,
  metersPerSliderStep,
} from '../utils/constants'

const InfoAccordion = ({
  accordionWidth = '400px',
  lockedSliderState,
  sliderValueListLeft,
  sliderValueListRight,
  lockState,
  unlockState,
  trackEvent,
  hoveredSide,
  setHoveredSide,
  changeLocationView,
  setCurrentZoom,
  setCurrentCenter,
  setCurrentLocation,
  handleInfoBoxClickLeft,
  handleInfoBoxClickRight,
  tabIndex,
  handleTabsChange,
}) => {
  return (
    <>
      <Flex
        flexDirection={'column'}
        gap={'20px'}
        border={'1px solid black'}
        alignItems={'center'}
      >
        <Accordion
          width={accordionWidth}
          defaultIndex={0}
          bg={'blue.300'}
          border={'2px solid black'}
          index={tabIndex}
          onChange={handleTabsChange}
          allowToggle
        >
          {Object.keys(locations).map((locationKey, index) => {
            return (
              <AccordionItem key={index}>
                <AccordionButton
                  color={'white'}
                  _expanded={{
                    borderWidth: '2px 2px 0px 2px',
                    borderColor: 'pink',
                  }}
                  _hover={{ bg: 'blue.500' }}
                  position={'relative'}
                  height={'60px'}
                  bg={
                    lockedSliderState[locationKey] == -1
                      ? unlockedAccordionButtonBG
                      : lockedAccordionButtonBG
                  }
                >
                  <Box>{locations[locationKey].description}</Box>
                  <AccordionIcon />

                  {lockedSliderState[locationKey] >= 0 && (
                    <>
                      <Icon
                        as={LockIcon}
                        position={'absolute'}
                        top={'2px'}
                        right={'2px'}
                        padding={'1px'}
                        width={'15px'}
                        height={'15px'}
                      />
                      {tabIndex != locationKey && (
                        <ChakraCircle
                          position={'absolute'}
                          color={'white'}
                          right={'20%'}
                          zIndex={100}
                          padding={'5px'}
                          border={'2px solid orange'}
                        >
                          <Flex
                            flexDirection={'column'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            height={'30px'}
                            width={'30px'}
                          >
                            <Box fontSize={'12px'} height={'12px'}>{`${
                              lockedSliderState[locationKey] *
                              metersPerSliderStep
                            }`}</Box>
                            <Box fontSize={'8px'} height={'8px'}>
                              m
                            </Box>
                          </Flex>
                        </ChakraCircle>
                      )}
                    </>
                  )}
                </AccordionButton>

                <AccordionPanel
                  borderWidth={'0px 2px 2px 2px'}
                  borderColor={'pink'}
                  bg={
                    lockedSliderState[locationKey] == -1
                      ? unlockedAccordionPanelBG
                      : lockedAccordionPanelBG
                  }
                  padding={'0px'}
                >
                  {lockedSliderState[locationKey] == -1 ? (
                    <InfoCardBayesian
                      trackEvent={trackEvent}
                      hoveredSide={hoveredSide}
                      setHoveredSide={setHoveredSide}
                      lockedSliderState={lockedSliderState}
                      unlockState={unlockState}
                      lockState={lockState}
                      changeLocationView={changeLocationView}
                      setCurrentLocation={setCurrentLocation}
                      setCurrentZoom={setCurrentZoom}
                      setCurrentCenter={setCurrentCenter}
                      mapType={'bayesian'}
                      locationKey={locationKey}
                      handleInfoBoxClickLeft={handleInfoBoxClickLeft}
                      handleInfoBoxClickRight={handleInfoBoxClickRight}
                      sliderValueList1={sliderValueListLeft}
                      sliderValueList2={sliderValueListRight}
                    ></InfoCardBayesian>
                  ) : (
                    // )
                    <Flex
                      justifyContent={'space-around'}
                      alignItems={'center'}
                      gap={'20px'}
                      padding={'12px'}
                    >
                      <Flex alignItems={'center'} gap={'10px'} color={'white'}>
                        Privatsphäre-Niveau:{' '}
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
                              lockedSliderState[locationKey] *
                              metersPerSliderStep
                            }`}</Box>
                            <Box fontSize={'10px'} height={'10px'}>
                              m
                            </Box>
                          </Flex>
                        </ChakraCircle>
                      </Flex>

                      <Button
                        border={'2px solid black'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        borderRadius={'50%'}
                        width={'40px'}
                        height={'40px'}
                        onClick={() => unlockState(locationKey)}
                      >
                        <Icon boxSize={'20px'} as={MdEdit}></Icon>
                      </Button>
                    </Flex>
                  )}
                </AccordionPanel>
              </AccordionItem>
            )
          })}
        </Accordion>
      </Flex>
    </>
  )
}

export default InfoAccordion
