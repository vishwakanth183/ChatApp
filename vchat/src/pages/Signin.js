import React, { useState } from 'react';
import { Box, Input, FormControl, FormLabel, Card, CardBody, CardHeader, Text, Button, HStack, Center } from '@chakra-ui/react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginRoute } from '../shared/APIRoutes';

function Signin(props) {

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    //Variable to handle navigation
    const navigation = useNavigate();

    // Variable to handle user name and password
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('')

    const handleSubmit = async () => {
        const { data } = await axios.post(loginRoute, {
            username: username,
            password: password,
        });
        if (data.status === false) {
            toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            );
            toast.success('Successfully logged in as ' + data.user.username, toastOptions);
            setTimeout(() => {
                navigation("/chats");
            }, 1000)
        }
    };


    return (
        <Box
            display={'flex'}
            alignItems='center'
            justifyContent='center'
            h='100vh'
            w='100vw'
            background={
                'url(https://images.everydayhealth.com/images/ordinary-fruits-with-amazing-health-benefits-05-1440x810.jpg) center/cover no-repeat'
            }
        >
            <ToastContainer />
            <Card bg={'white'} w={500} boxShadow='dark-lg'>

                <CardHeader bg={'purple'}>
                    <Text textAlign={'center'} fontSize={'2xl'} color='white' fontFamily={'Righteous'} >Signin to continue into VKCHATS</Text>
                </CardHeader>
                <CardBody>

                    <FormControl isRequired>

                        {/* Name */}
                        <FormLabel color={'black'} fontFamily='Righteous'>Name</FormLabel>
                        <Input color={'black'} fontFamily='Montserrat' placeholder='First name' value={username} onChange={(event) => setUserName(event.target.value)} />

                        {/* Password */}
                        <FormLabel color={'black'} fontFamily='Righteous' pt={5}>Passsword</FormLabel>
                        <Input color={'black'} fontFamily='Montserrat' type={'password'} placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />

                        {/* Register button */}
                        <Center flexDirection={'row'} mt={5}>
                            <Box display={'flex'} alignItems={'center'} justifyContent='center'>
                                <Button colorScheme='teal' variant='solid' mr={5} fontFamily='Righteous' bg={'purple'} letterSpacing='wider' onClick={() => { handleSubmit() }}>
                                    Signin
                                </Button>
                            </Box>

                            {/* Register button */}
                            <Box display={'flex'} alignItems={'center'} justifyContent='center'>
                                <Button onClick={() => navigation('register')}
                                    colorScheme='teal' variant='solid' fontFamily='Righteous' bg={'purple'} letterSpacing='wider'>
                                    SignUp
                                </Button>
                            </Box>
                        </Center>

                    </FormControl>


                </CardBody>
            </Card>
        </Box>
    );
}

export default Signin;