import {
  Box,
  Text,
  Heading,
  Button,
  VStack,
  Flex,
  HStack,
  Center,
  Link,
  Container,
  Radio,
  RadioGroup,
  Image,
  SimpleGrid,
} from '@chakra-ui/react'
import NavigationButton from '../../components/NavigationButton'

const Conditons = () => {
  return (
    <>
      <Flex flexDirection={'column'} alignItems={'center'} gap={10}>
        {['c1', 'c2', 'c3'].map((cond, index) => {
          return <NavigationButton key={index} href={cond} buttonText={cond} />
        })}
      </Flex>
    </>
  )
}

export default Conditons
