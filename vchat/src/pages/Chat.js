import React, { useState, useEffect, useRef } from 'react';
import { Container, Grid, GridItem, Box, Center, Text } from '@chakra-ui/react';
import Lottie from 'lottie-react'

// Custom imports
import ChatList from '../components/ChatList';
import ChatDetails from '../components/ChatDetails';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { host } from '../shared/APIRoutes';

function Chat(props) {

    // Empty chat lottie
    const emptyChat = require('../asssets/emptyChat.json')
    const emptyBg = require('../asssets/parrot.jpg')

    // Variable to handle socket
    const socket = useRef()

    // Variable to handle currentselected chat
    const [selectedChat, setSelectedChat] = useState();

    // Variable to handle current user
    const [currentUser, setCurrentUser] = useState();

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

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    // Function to handle selected chat
    const handleChat = (val) => {
        setSelectedChat(val)
    }

    return (
        <Box w={'100vw'} overflow='-moz-hidden-unscrollable'>
            <Grid templateColumns='repeat(2, 1fr)' h={'100vh'} maxW={'100vw'} overflow='-moz-hidden-unscrollable'>

                {/* Chat List */}
                <GridItem w='30vw' h='100%' bg='lightgreen' overflow={'-moz-hidden-unscrollable'}>
                    <ChatList handleChat={handleChat} />
                </GridItem>

                {/* Chat Details */}
                <GridItem w='70vw' maxH='100vh' background={`url(${emptyBg}) center/cover no-repeat`} overflow={'-moz-hidden-unscrollable'}>
                    {
                        selectedChat ?
                            <ChatDetails currentUser={currentUser} currentChat={selectedChat} socket={socket}/>
                            :
                            <Center h={'100vh'} flexDirection='row'>
                                <Lottie animationData={emptyChat} loop={true} style={{ height: 400 }} />
                                <Text bg={'purple'} p={3} borderRadius='full' boxShadow={'dark-lg'} color='white' fontFamily={'Righteous'} fontSize='2xl'>Select a chat to start messaging</Text>
                            </Center>
                    }
                </GridItem>
            </Grid>
        </Box>
    );
}

export default Chat;