import { Box, Button, Link } from '@chakra-ui/react'

const DonationButton = () => {
  return (
    <div>
      <Link href={`/static/thanks`} boxShadow={'dark-lg'}>
        <Button
          fontSize={'xl'}
          bg={'orange.400'}
          height={'100px'}
          boxShadow={'dark-lg'}
          flexDirection={'column'}
          border={'2px solid black'}
          padding={'10px'}
          _hover={{ bg: 'blue.400' }}
        >
          <Box>Mobilitätsdaten jetzt</Box>
          <Box>anonymisiert übertragen</Box>
        </Button>
      </Link>
    </div>
  )
}

export default DonationButton
