import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Divider, Text, Center, Avatar, AvatarBadge, VStack, HStack, Badge } from '@chakra-ui/react'
import axios from 'axios';
import { allUsersRoute } from '../shared/APIRoutes';
import { useNavigate } from 'react-router-dom';

function ChatList({ handleChat }) {

    // Variable to handle chatItems
    const [chatItems, setChatItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    // Variable to handle list of contacts available for chatting
    const [contacts, setContacts] = useState([]);

    // Variable to handle current selected chat
    const [currentChat, setCurrentChat] = useState(undefined);

    // Variable to handlue user
    const [currentUser, setCurrentUser] = useState(undefined);

    // Variable to handle navigation
    const navigation = useNavigate()

    // UseEffect to get current user details
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigation("/");
        } else {
            setCurrentUser(
                JSON.parse(
                    localStorage.getItem('user')
                )
            );
        }
    }, []);

    //   Socket useEffect
    //   useEffect(() => {
    //     if (currentUser) {
    //       socket.current = io(host);
    //       socket.current.emit("add-user", currentUser._id);
    //     }
    //   }, [currentUser]);

    // UseEffect to get contact list from server
    useEffect(() => {
        if (currentUser) {
            fetchContacts()
        }
    }, [currentUser]);

    // Function to fetch contacts
    const fetchContacts = async () => {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        console.log(data)
        setContacts(data.data);
    }


    return (
        <Box h='100vh' w={'100%'} overflow='-moz-hidden-unscrollable'>
            <Grid
                templateRows={'repeat(3,1fr)'}
                templateColumns='repeat(1, 1fr)'
                h={'100%'}
                gap={0}
                display={'flex'}
                overflow={'-moz-hidden-unscrollable'}
                flexDirection={'column'}
            >

                {/* Top Element */}
                <GridItem w='100%' h='10vh' bg='black'>
                    <Box padding={3} display='flex' flexDirection={'row'}>
                        <Avatar >
                            <AvatarBadge borderColor='papayawhip' bg='green' boxSize='0.9em' />
                        </Avatar>

                        <HStack>
                            {/* Name view with message */}
                            <VStack alignItems={'flex-start'} w={'100%'} display='flex' flex={1}>

                                <HStack display={'flex'} alignItems='center' justifyContent={'center'} mb={-2}>
                                    <Text color={'white'} fontSize='larger' pl={4} fontFamily={'Righteous'} fontWeight='thin' flexWrap='wrap' >
                                        {currentUser?.username}
                                    </Text>
                                    <Badge fontFamily={'Montserrat'} pl={4} pr={4} borderRadius='full' bg={'coral'} color='white' letterSpacing={'widest'}>
                                        VKCHATS
                                    </Badge>
                                </HStack>

                                <Text color={'white'} fontSize='smaller' pl={4} fontFamily={'Montserrat'} fontWeight='medium'>
                                    Online
                                </Text>
                            </VStack>
                        </HStack>
                    </Box>

                </GridItem>

                {/* Scroll Element */}
                <GridItem w='100%' h='90vh' bg='white' overflow={'hidden'} overflowY='scroll' sx={{
                    '&::-webkit-scrollbar': {
                        width: '4px',
                        borderRadius: '8px',
                        backgroundColor: `#ddd`,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'grey',
                        height: '4px'
                    },
                }}>
                    {
                        contacts.map((item, index) => {
                            return <Box bg={index == currentChat ? 'rebeccapurple' : 'aliceblue'} w={'100%'} cursor='pointer' _hover={{
                                bg: index == currentChat ? 'rebeccapurple' : 'purple.100',
                            }} _active={{
                                bg: 'purple.100'
                            }} onClick={() => { handleChat(item); setCurrentChat(index) }} >
                                <Box padding={3} display='flex' flexDirection={'row'}>

                                    {/* Avatar Badge */}
                                    <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' >
                                        <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='0.9em' />
                                    </Avatar>

                                    {/* Message View */}
                                    <HStack w={'100%'}>

                                        {/* Name view with message */}
                                        <VStack alignItems={'flex-start'} w={'83%'} display='flex' flex={1}>

                                            <Text color={index == currentChat ? 'white' : 'black'} fontSize='larger' pl={4} fontFamily={'Righteous'} fontWeight='thin' noOfLines={1} flexWrap='wrap' maxW={'70%'}>
                                                {item.username}
                                            </Text>

                                            <Text color={index == currentChat ? 'white' : 'black'} fontSize='medium' pl={4} fontFamily={'Montserrat'} fontWeight='medium'>
                                                This is the last message
                                            </Text>
                                        </VStack>

                                        {/* Message count view */}
                                        <Box w={'5%'} display={'flex'} alignSelf='center'>
                                            <Badge variant='solid' colorScheme='green' borderRadius={'3xl'}>
                                                1
                                            </Badge>
                                        </Box>

                                    </HStack>


                                </Box>
                                <Divider />
                            </Box>
                        })
                    }
                </GridItem>

                {/* Bottom Element */}
                {/* <GridItem w='100%' h='10vh' bg='black'>
                    <Center fontFamily={'Righteous'} h={'100%'} flexDirection='column'>
                        <Text fontSize={'3xl'} color='white' >VK CHATS</Text>
                    </Center>
                </GridItem> */}

            </Grid>
        </Box>
    );
}

export default ChatList;