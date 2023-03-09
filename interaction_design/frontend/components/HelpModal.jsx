import {
  Box,
  Icon,
  useDisclosure,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { QuestionOutlineIcon } from '@chakra-ui/icons'

const HelpModal = () => {
  const {
    isOpen: instructionIsOpen,
    onOpen: instructionOnOpen,
    onClose: instructionOnClose,
  } = useDisclosure()

  return (
    <div>
      <IconButton
        zIndex={100}
        position={'absolute'}
        right={'2'}
        bottom={'2'}
        aria-label="Help"
        bg={'white'}
        onClick={instructionOnOpen}
        borderRadius={'50%'}
        icon={<Icon boxSize={'40px'} as={QuestionOutlineIcon} />}
      />
      <Modal
        isOpen={instructionIsOpen}
        onClose={instructionOnClose}
        closeOnOverlayClick={true}
      >
        <ModalOverlay />
        <ModalContent width={'60vw'} maxW={'60vw'}>
          <ModalCloseButton />
          <ModalBody width={'60vw'} padding={'50px'}>
            <Flex
              justifyContent={'center'}
              alignItems={'flex-start'}
              flexDirection={'column'}
            >
              Sie haben Fragen oder ein Problem? Senden Sie eine E-Mail an:
              <Box fontSize={'2xl'} as={'b'} mt={'20px'}>
                fabrizio.kuruc@fu-berlin.de
              </Box>
              <Box mt={'15px'}>oder</Box>
              <Box fontSize={'2xl'} as={'b'} mt={'20px'}>
                clmb@inf.fu-berlin.de
              </Box>
              <Box mt={'20px'}>
                Wir versuchen Ihr Anliegen umgehend zu bearbeiten.
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default HelpModal
