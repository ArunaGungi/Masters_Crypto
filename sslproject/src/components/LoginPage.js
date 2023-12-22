import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:3243/auth/login', {
        username: username,
        password,
      });

      console.log("response", response);
      if(response?.data?.message === "User Validated") {
        navigate('/userscreen');
      }
      else {
        window.alert("Invalid Credentials");
      }
      
    } catch (error) {
      console.error('Error during login:', error);
      window.alert(error.response.data.message);
      // Set inputError to true when there is an error
      setInputError(true);
      // Set the error message
      setErrorMessage('Please enter valid credentials.');
    }
  };

  return (
    <>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Admin Portal Login</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Username</FormLabel>
                <Input
                  type="name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // Apply a red border if there is an error
                  borderColor={inputError ? 'red.500' : 'inherit'}
                />
                {inputError && (
                  <Text fontSize="sm" color="red.500">
                    {errorMessage}
                  </Text>
                )}
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Apply a red border if there is an error
                  borderColor={inputError ? 'red.500' : 'inherit'}
                />
                {inputError && (
                  <Text fontSize="sm" color="red.500">
                    {errorMessage}
                  </Text>
                )}
              </FormControl>
              <Stack spacing={10}>
                {/* <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack> */}
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={handleLogin}>
                  Sign in
                </Button>
              </Stack>
              <Stack>
                <Text>Don't have an account?</Text><Button onClick={() => navigate("/register")}>Register</Button>
              </Stack>

            </Stack>
          </Box>
        </Stack>
      </Flex>

    </>
  );
};

export default Login;
