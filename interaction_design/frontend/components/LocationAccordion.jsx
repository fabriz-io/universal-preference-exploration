import {
  minEpsilon,
  maxEpsilon,
  minRadius,
  maxRadius,
  mapBounds,
  minMapZoom,
  locations,
  amountSliderSteps,
  maxBarWidth,
  api_host,
} from '../api/constants'

import {
  Box,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Radio,
  Icon,
  RadioGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  StackDivider,
  IconButton,
  Button,
  Center,
  Circle as ChakraCircle,
  Link,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  MdGraphicEq,
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
} from '@chakra-ui/react'

import React from 'react'

import InfoCardBayesian from './InfoCardBayesian'

const LocationAccordion = ({
  handleTabsChange,
  lockedSliderState,
  currentLocation,
}) => {
  return (
    <div>
      <Accordion
        defaultIndex={0}
        bg={'blue.300'}
        color={'white'}
        width={'250px'}
        border={'2px solid black'}
        onChange={handleTabsChange}
        allowToggle
      >
        {Object.keys(locations).map((locationKey) => {
          return (
            <AccordionItem key={locationKey}>
              <h2>
                <AccordionButton
                  _expanded={{ bg: 'blue.800' }}
                  _hover={{ bg: 'blue.500' }}
                  position={'relative'}
                >
                  <Flex justifyContent={'space-between'}>
                    <Box>{locations[locationKey].description}</Box>
                    <AccordionIcon />
                  </Flex>
                  {lockedSliderState[locationKey] >= 0 && (
                    <Icon
                      as={LockIcon}
                      position={'absolute'}
                      top={'2px'}
                      right={'2px'}
                      padding={'1px'}
                      width={'12px'}
                      height={'12px'}
                    />
                  )}
                </AccordionButton>
              </h2>
              <AccordionPanel
                height={'500px'}
                bg={locationKey == currentLocation ? 'blue.800' : 'blue.200'}
              >
                <InfoCardBayesian
                //   trackEvent={trackEvent}
                //   hoveredSide={hoveredSide}
                //   setHoveredSide={setHoveredSide}
                //   lockedSliderState={lockedSliderState}
                //   unlockState={unlockState}
                //   lockState={lockState}
                //   changeLocationView={changeLocationView}
                //   setCurrentLocation={setCurrentLocation}
                //   setCurrentZoom={setCurrentZoom}
                //   setCurrentCenter={setCurrentCenter}
                //   mapType={'bayesian'}
                //   locationKey={locationKey}
                //   locationState={locationState[locationKey]}
                //   handleInfoBoxClickLeft={handleInfoBoxClickLeft}
                //   handleInfoBoxClickRight={handleInfoBoxClickRight}
                //   cardState1={cardStateLeft}
                //   setCardState1={setCardStateLeft}
                //   sliderValueList1={sliderValueListLeft}
                //   cardState2={cardStateRight}
                //   setCardState2={setCardStateRight}
                //   sliderValueList2={sliderValueListRight}
                ></InfoCardBayesian>
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
export default LocationAccordion
