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
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'
import { useEffect } from 'react'

const TaskPage = () => {
  return (
    <div>
      <VStack
        h={'50vh'}
        w={'100vw'}
        spacing={'50px'}
        borderBottom={'2px solid black'}
        // border={'2px solid black'}
      >
        <Container>
          Bei Differential Privacy hängt die Größe des Radius von einem
          Parameter namens <Text as="b">Epsilon </Text>
          ab.
        </Container>
        <Container>{'Grundsätzlich gilt:'}</Container>
        <Container fontSize={'2xl'}>
          <Center>
            <Text as="b">Je größer das Epsilon, desto kleiner der Radius</Text>
          </Center>
        </Container>
        <Container fontSize={'2xl'}>
          <Center>
            <Text as="b">Je kleiner das Epsilon, desto größer der Radius</Text>
          </Center>
        </Container>
      </VStack>

      <VStack
        h={'100vh'}
        // bg={'green.200'}
        // marginTop={'200px'}
        w={'100vw'}
        spacing={'60px'}
        borderBottom={'2px solid black'}
      >
        <Heading>Studie zur Erhebung von Mobilitätsdaten</Heading>
        <Container paddingTop={'100px'}>
          Die Privatsphärebedürfnisse eines jeden Menschen sind sehr
          unterschiedlich. Um diesen individuellen Privatsphärebedürfnissem
          entgegen zu kommen, möchte die SVG allen Nutzer:innen die Möglichkeit
          geben, die Anonyimiserung ihrer Mobilitätsdaten entsprechend der
          Privatsphärebedürfnisse selbst zu bestimmen.
        </Container>
        <Container>
          Zur Vereinfachung der Mobilitätsdaten-Erhebung werden Ihnen auf der
          nächsten Seite fünf fiktive bzw. von Ihnen besuchte Orte auf einer
          Stadtkarte von Berlin angezeigt werden:
        </Container>
        <Container>
          <UnorderedList>
            <ListItem>Dein Zuhause</ListItem>
            <ListItem>Deine Arbeitsstelle</ListItem>
            <ListItem>Bushaltestelle</ListItem>
            <ListItem>U-Bahn Station</ListItem>
            <ListItem>Ein persönlicher Ort*</ListItem>
          </UnorderedList>
          <Text marginTop={'10px'} fontSize={'sm'}>
            * ein Ort, der für Sie sehr privat ist und nicht mit jeder Person
            geteilt werden soll
          </Text>
        </Container>
      </VStack>

      <VStack w={'100vw'} spacing={'60px'} height={'80vh'}>
        <Heading>Ihre Aufgabe</Heading>
        <Container fontSize={'2xl'}>
          Bestimmen Sie für die fünf augezeigten Orte auf der nächsten Seite Ihr
          individuelles Privatsphärebedürfnis.
        </Container>

        <Container fontSize={'2xl'}>
          Durch die Festlegung Ihres individuellen Privatsphärebedürfnisses
          entscheiden Sie selbst, in welchem Umfang Ihre Mobilitätsdaten
          anonymisiert und schließlich gespendet werden.
        </Container>
        <Center w={'80vw'}>
          <Link key={0} href={'/conditions'}>
            <Button h={'100px'} bg={'blue.600'} w={'800px'} margin={'60px'}>
              Studie starten
            </Button>
          </Link>
        </Center>
      </VStack>
    </div>
  )
}

export default TaskPage
