import React, { useState, useEffect, useRef } from 'react';
import { Box, Center, Text, Avatar, ButtonGroup, Button, AvatarBadge, VStack, HStack, IconButton, Textarea, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { HiDotsVertical, HiOutlineEmojiHappy } from 'react-icons/hi';
import Picker from 'emoji-picker-react'
import { FaPhoneAlt, FaTelegramPlane, FaVideo } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { recieveMessageRoute, sendMessageRoute } from '../shared/APIRoutes';
import { v4 as uuidv4 } from 'uuid';

function ChatDetails({ currentUser, currentChat, socket }) {

    // List of messages
    const [messages, setMessages] = useState([]);

    // Variable used to scroll to bottom
    const scrollRef = useRef();

    const [arrivalMessage, setArrivalMessage] = useState(null);

    // Variable to handle emoji picker
    const [showPicker, setShowPicker] = useState(false)

    // Variable to handle message
    const [currentMessage, setCurrentMessage] = useState('')

    // Variable to handle chats
    const [chats, setChats] = useState(['Hello', 'Hi', 'Welcome', 'Who are you', 'How are you', 'I am fine', 'What about you'])

    // Variable to handle navigation
    const navigation = useNavigate()

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('user')
        navigation('/')
    }

    // Function to get messaages
    const getMessages = async () => {
        const data = await JSON.parse(
            localStorage.getItem('user')
        );
        const response = await axios.post(recieveMessageRoute, {
            from: data._id,
            to: currentChat._id,
        });
        setMessages(response.data);
    }

    //Function to handle message
    const handleSendMsg = async () => {
        if (currentMessage) {
            const data = await JSON.parse(
                localStorage.getItem('user')
            );
            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: data._id,
                msg : currentMessage,
            });
            await axios.post(sendMessageRoute, {
                from: data._id,
                to: currentChat._id,
                message: currentMessage,
            }).then((res) => {
                console.log('fnqwnqoifnqowin')
                const msgs = [...messages];
                msgs.push({ fromSelf: true, message: currentMessage });
                setMessages(msgs);
                setCurrentMessage('')
            }).catch((err) => {
                alert('Failed to send message')
            })
        }
    };

    // Initial message
    useEffect(() => {
        getMessages()
    }, [currentChat]);

    // Onsocket changes
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    //   new message
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    //   Scroll to 
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <Box height={'100vh'} >

            {/* Top Bar */}
            <Box w='100%' h='10vh' bg={'rebeccapurple'} justifyContent={'space-between'} display='flex'>

                {/* Left View */}
                <Box h={'100%'}>
                    <Center h={'100%'} pl={5}>
                        <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' >
                            <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='0.9em' />
                        </Avatar>
                        <VStack pl={4} display='flex' w={200} justifyContent='flex-end' alignItems={'flex-start'}>
                            <Text fontSize={'2xl'} fontFamily={'Righteous'} color='white' display={'flex'} mb={-3} >{currentChat?.username}</Text>
                            <Text fontSize={'sm'} fontFamily={'Montserrat'} color='white'>Last seen 2days ago</Text>
                        </VStack>
                    </Center>
                </Box>

                {/* Right View */}
                <Box>
                    <HStack justifyContent='center' alignItems={'center'} h='10vh' pr={5}>

                        <IconButton
                            colorScheme='whiteAlpha'
                            borderRadius={'full'}
                            size='md'
                            icon={<FaPhoneAlt />}
                        />

                        <IconButton
                            colorScheme='whiteAlpha'
                            borderRadius={'full'}
                            size='md'
                            icon={<FaVideo />}
                        />

                        {/* <IconButton
                            colorScheme='whiteAlpha'
                            borderRadius={'full'}
                            size='md'
                            icon={<HiDotsVertical />}
                        /> */}

                        <Menu>
                            <MenuButton>
                                <IconButton
                                    colorScheme='whiteAlpha'
                                    borderRadius={'full'}
                                    size='md'
                                    icon={<HiDotsVertical />}
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem bg={'white'} justifyContent='flex-end'>
                                    <Button fontFamily={'Righteous'} bg='white' onClick={() => logout()}>
                                        Logout
                                    </Button>
                                </MenuItem>
                            </MenuList>
                        </Menu>

                    </HStack>
                </Box>

            </Box>

            {/* Chat with scroll */}
            <Box  onClick={() => { setShowPicker(false) }} h={'80vh'} bg='white' w={'70vw'} overflowY='scroll' sx={{
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
                    messages.map((item, index) => {
                        return <Box ref={scrollRef} w={'100%'} key={uuidv4()} display='flex' justifyContent={!item.fromSelf ? 'flex-start' : 'flex-end'} p={5} >
                            <Text
                                // maxW={'50vw'}
                                p={3}
                                borderRadius='full'
                                bg={!item.fromSelf ? 'purple.300' : 'whatsapp.100'}
                                fontFamily='Righteous'
                            >
                                {item?.message}
                            </Text>
                        </Box>
                    })
                }
            </Box>

            {/* Message input view */}
            <HStack h={'10vh'} bg='white' p={5}>
                {showPicker ?
                    <Box position={'fixed'} top={'25vh'}>
                        <Picker onEmojiClick={(event, val) => {
                            console.log(event.emoji)
                            // console.log(val)
                            setCurrentMessage(currentMessage + event.emoji)
                        }} />
                    </Box>
                    : null}
                <IconButton
                    colorScheme={'yellow'}
                    borderRadius='full'
                    icon={<HiOutlineEmojiHappy />}
                    onClick={() => setShowPicker(!showPicker)}
                />
                <Textarea placeholder='type something...' value={currentMessage} color='black'
                    onChange={(event) => {
                        setCurrentMessage(event.target.value)
                    }}
                    display={'flex'} borderRadius={'full'} minH={'50%'} multiple />
                <IconButton
                    onClick={() => { handleSendMsg() }}
                    colorScheme={'purple'}
                    borderRadius='full'
                    icon={<FaTelegramPlane />}
                />

            </HStack>
        </Box>
    );
}

export default ChatDetails;