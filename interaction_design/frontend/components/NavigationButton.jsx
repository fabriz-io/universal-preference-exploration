import { Button, Link } from '@chakra-ui/react'

const NavigationButton = ({
  href,
  buttonText,
  onClick,
  isDisabled = false,
}) => {
  return (
    <>
      <Link key={0} href={`/static/${href}`} onClick={onClick}>
        <Button
          bg={'white'}
          border={'2px solid black'}
          padding={'20px'}
          _hover={{ bg: 'blue.400' }}
          isDisabled={isDisabled}
        >
          {buttonText}
        </Button>
      </Link>
    </>
  )
}

export default NavigationButton
