import { TbPlus, TbMinus } from 'react-icons/tb'
import { MdSave, MdEdit } from 'react-icons/md'

import {
  Box,
  Icon,
  Button,
  IconButton,
  Center,
  Circle as ChakraCircle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Heading,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

const instructionModalWidth = '900px'

import { InfoOutlineIcon, QuestionIcon } from '@chakra-ui/icons'

const InstructionModal = ({
  instructionIsOpen,
  instructionOnClose,
  instructionOnOpen,
  children,
}) => {
  return (
    <div>
      {instructionIsOpen ? (
        <Modal
          isOpen={instructionIsOpen}
          onClose={instructionOnClose}
          // onClose={}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent
            width={instructionModalWidth}
            maxW={instructionModalWidth}
          >
            {/* <ModalHeader>
              <Center fontSize={'2xl'}>Anleitung</Center>
            </ModalHeader> */}
            <ModalCloseButton />
            <ModalBody
              width={instructionModalWidth}
              padding={'50px'}
              maxW={instructionModalWidth}
            >
              <Flex
                justifyContent={'center'}
                alignItems={'flex-start'}
                flexDirection={'column'}
              >
                <Center justifyContent={'center'} width={'100%'}>
                  <Flex
                    // width={'500px'}
                    flexDirection={'column'}
                    // justifyContent={'center'}
                    // alignItems={'flex-start'}
                    gap={5}
                    fontSize={'xl'}
                  >
                    <Box>
                      Diese Bedienoberfläche soll Sie bei der Auswahl Ihrer
                      Privatssphäre-Niveaus unterstützen.
                    </Box>
                    <Heading>Erklärung:</Heading>
                    {children}
                    <Box>
                      Sobald die Privatsphäre-Niveaus für alle Orte ausgewählt
                      sind, können Sie Ihre Mobilitätsdaten mit den gewählten
                      Privatsphäre-Niveaus spenden.
                    </Box>

                    <Flex flexDirection={'column'}>
                      <Flex mt={'30px'} alignItems={'center'}>
                        <Flex
                          width={'100px'}
                          alignItems={'center'}
                          justifyContent={'flex-end'}
                        >
                          <Icon
                            boxSize={'30px'}
                            margin={'3px'}
                            as={TbPlus}
                          ></Icon>
                          <Text fontSize={'22px'}>/</Text>
                          <Icon
                            margin={'10px'}
                            as={TbMinus}
                            boxSize={'30px'}
                          ></Icon>{' '}
                        </Flex>
                        <Text>Karte zoomen.</Text>
                      </Flex>

                      {/* <Icon as={MdSave}></Icon> */}
                      <Flex alignItems={'center'}>
                        <Flex
                          width={'100px'}
                          alignItems={'center'}
                          justifyContent={'flex-end'}
                        >
                          <Icon
                            as={MdSave}
                            boxSize={'30px'}
                            m={'10px'}
                            borderRadius={'4px'}
                            // padding={'4px'}
                          ></Icon>
                        </Flex>
                        <Text>Privatsphäre-Niveau speichern</Text>
                      </Flex>
                      <Flex alignItems={'center'}>
                        <Flex
                          width={'100px'}
                          alignItems={'center'}
                          justifyContent={'flex-end'}
                        >
                          <Icon
                            as={MdEdit}
                            boxSize={'30px'}
                            m={'10px'}
                            borderRadius={'4px'}
                            // padding={'4px'}
                          ></Icon>
                        </Flex>
                        <Text> Privatsphäre-Niveau bearbeiten</Text>
                      </Flex>
                    </Flex>
                    <Box mt={'30px'} fontSize={'sm'}>
                      {
                        'Sie können diese Anleitung jederzeit wieder ansehen mit einem Klick auf'
                      }
                      <IconButton
                        aria-label="Info"
                        bg={'white'}
                        borderRadius={'50%'}
                        icon={<Icon boxSize={'20px'} as={InfoOutlineIcon} />}
                      />
                      {'am linken unteren Bildschirmrand.'}
                    </Box>
                  </Flex>
                </Center>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button
                bg={'white'}
                border={'1px solid black'}
                onClick={instructionOnClose}
              >
                Ok
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        // <Button
        //   onClick={instructionOnOpen}
        //   // padding={'25px'}
        //   // width={'200px'}
        //   zIndex={100}
        //   position={'absolute'}
        //   bottom={0}
        //   left={0}
        //   borderRadius={'4px'}
        //   margin={'10px'}
        //   border={'1px solid black'}
        //   fontSize={'l'}
        //   bg={'yellow.400'}
        //   boxShadow={'dark-lg'}
        //   sx={{
        //     '.instruction-button:hover &': {
        //       bg: 'blue.500',
        //     },
        //   }}
        // >

        <IconButton
          zIndex={100}
          position={'absolute'}
          left={'2'}
          bottom={'2'}
          aria-label="Info"
          bg={'white'}
          onClick={instructionOnOpen}
          // padding={'5px'}
          // border={'1px solid black'}
          borderRadius={'50%'}
          icon={<Icon boxSize={'40px'} as={InfoOutlineIcon} />}
        />
      )}
    </div>
  )
}

export default InstructionModal
