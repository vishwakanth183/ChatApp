import React, { useState } from 'react';
import { Box, Input, FormControl, FormLabel, Card, CardBody, CardHeader, Text, Button } from '@chakra-ui/react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registerRoute } from '../shared/APIRoutes';

function Signup(props) {

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
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = async () => {
        const { data } = await axios.post(registerRoute, {
            username: username,
            email: email,
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
            toast.error('Registration successfull', toastOptions);
            navigation("/");
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
                    <Text textAlign={'center'} fontSize={'2xl'} color='white' fontFamily={'Righteous'} >Register and join VKCHATS</Text>
                </CardHeader>
                <CardBody>

                    <FormControl isRequired>

                        {/* Name */}
                        <FormLabel fontFamily='Righteous'>Name</FormLabel>
                        <Input fontFamily='Montserrat' placeholder='First name' value={username} onChange={(event) => setUserName(event.target.value)} />

                        {/* Email */}
                        <FormLabel pt={5} fontFamily='Righteous'>Email</FormLabel>
                        <Input fontFamily='Montserrat' type={'email'} placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} />

                        {/* Password */}
                        <FormLabel pt={5} fontFamily='Righteous'>Passsword</FormLabel>
                        <Input fontFamily='Montserrat' type={'password'} placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />

                        {/* Register button */}
                        <Box w={'100%'} display={'flex'} alignItems={'center'} justifyContent='center'>
                            <Button colorScheme='teal' variant='solid' mt={5} fontFamily='Righteous' bg={'purple'} letterSpacing='wider' onClick={() => { handleSubmit() }} disabled={!username || !password || !email}>
                                Register
                            </Button>
                        </Box>

                    </FormControl>


                </CardBody>
            </Card>
        </Box>
    );
}

export default Signup;