import { Box, Button, Flex, Spacer, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    }
    return (
        <>
            <Flex minH={'60px'} py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'} bg={"grey"}>
                <Box>
                    <Text
                        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                        fontFamily={'heading'}
                        color={"white"}>
                        Crypto SSL Admin Portal
                    </Text>
                </Box>
                <Spacer/>
                <Box>
                    <Button onClick={() => handleLogout()}>
                        Logout
                    </Button>
                </Box>
            </Flex>
        </>
    )
}

export default Navbar