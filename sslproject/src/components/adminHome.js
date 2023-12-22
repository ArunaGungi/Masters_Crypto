import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

function HomePage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        console.error('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const getPublicKeys = await axios.get('https://localhost:3243/key/exchangePublicKeys');

      console.log("get public keys", getPublicKeys);

      const {clientPublicKey, serverPublicKey} = getPublicKeys.data;
;
      const getSecretKey = await axios.post('https://localhost:3243/key/validateSecretKey', {
        clientPublicKey : clientPublicKey,
        serverPublicKey : serverPublicKey
      });

      console.log("getSecretKey", getSecretKey);

      if(getSecretKey?.data?.result) {
        
        formData.append('sharedSecret', getSecretKey?.data?.generatedSecretKey);
        const response = await axios.post('https://localhost:3243/file/upload', formData);
  
        console.log('File uploaded successfully:', response.data);
  
        // Set the upload response in the state
        setUploadResponse(response.data);
  
        // Fetch files again to update the table
        fetchFiles();
      }
      else {
        window.alert("Invalid Authorization");
      }
      
    } catch (error) {
      console.error('Error uploading file:', error.response.data);
      // Set the upload response in the state even in case of an error
      setUploadResponse(error.response.data);
    }
  };

  const handleFileDownload = async (filename) => {
    try {
      const response = await axios.get(`https://localhost:3243/file/download/${filename}`, {
        responseType: 'blob', // Specify the response type as a blob
      });

      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error.response.data);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      const response = await axios.delete(`https://localhost:3243/file/delete/${fileId}`, {
      });

      console.log('File deleted successfully:', response.data);

      // Fetch files again to update the table
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error.response.data);
    }
  };

  const fetchFiles = async () => {
    console.log(files);
    try {
      const response = await axios.get('https://localhost:3243/file/display', {
      });
      console.log("files response", files);
      setFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching files:', error.response.data);
    }
  };

  useEffect(() => {
    // console.log("hello");
    fetchFiles();
  }, []);

  return (
    <div>
      <Navbar />
      <HStack maxW="md" mx="auto" mt="8">
        <FormControl>
          <Center>
            <FormLabel>Choose a file to upload</FormLabel>

          </Center>
          <Input type="file" onChange={handleFileChange} p={1} />
        </FormControl>
        <Button
          mt="8"
          size={"sm"}
          colorScheme="teal"
          onClick={handleFileUpload}
          _hover={{ bg: 'teal.600' }}
        >
          Upload file
        </Button>
      </HStack>

      {/* <Divider p="4" /> */}
      <Center p="10">
        {uploadResponse ?

          <TableContainer>
            <Table variant="simple">
              <TableCaption>File Upload Response</TableCaption>
              <Thead>
                <Tr>
                  <Th>Status</Th>
                  <Th>Message</Th>
                  <Th>File Information</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{uploadResponse?.status}</Td>
                  <Td>{uploadResponse?.message}</Td>
                  <Td>{uploadResponse?.file ? uploadResponse.file.filename : ''}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer> : ""}
      </Center>

      {/* <Center> */}
      <VStack>
        <Box>
          <Heading size="md">Existing Files Information</Heading>
        </Box>
        <Box>
        {files.length ?
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>File Name</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {files.map((file) => (
                    <Tr key={file._id}>
                      <Td>{file.filename}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleFileDelete(file._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          colorScheme="teal"
                          size="sm"
                          ml={4}
                          onClick={() => handleFileDownload(file.filename)}
                        >
                          Download
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            : <Text size={10} p={4}>No Data to display</Text>}
        </Box>
      </VStack>
      {/* </Center> */}
    </div>
  );
}

export default HomePage;
