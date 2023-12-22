import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Toast,
  useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Perform input validation
      if (!username || !password) {
        setInputError(true);
        setErrorMessage('Username and password are required.');
        return;
      }

      // Perform registration API call
      const response = await axios.post('https://localhost:3243/auth/register', {
        username: username,
        password: password,
      })

      // console.log("response from backend for registration", response);
      const publicKey = response.data.publicKey;
      // Check if registration was successful
      if (response.status === 201) {
        // You may handle successful registration here (e.g., redirect to login)
        console.log('Registration successful!');
        window.alert("User registered successful");
        navigate("/userscreen", { state: { publicKey } });
      } else {
        // Handle registration error
        setInputError(true);
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setInputError(true);
      setErrorMessage('Internal server error. Please try again later.');
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Registration Portal</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // Apply a red border if there is an error
                borderColor={inputError ? 'red.500' : 'inherit'}
              />
              {/* {inputError && (
                <Text fontSize="sm" color="red.500">
                  {errorMessage}
                </Text>
              )} */}
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
              {/* {inputError && (
                <Text fontSize="sm" color="red.500">
                  {errorMessage}
                </Text>
              )} */}
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'green.400'}
                color={'white'}
                _hover={{
                  bg: 'green.500',
                }}
                onClick={handleRegister}>
                Register
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      {errorMessage ? <Toast>{errorMessage}</Toast> : ""}
    </Flex>
  );
};

export default RegisterPage;
