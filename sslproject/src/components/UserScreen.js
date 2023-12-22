import {
    Box,
    Button,
    Heading,
    Table,
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
  
  function UserScreen({ onLogout }) {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResponse, setUploadResponse] = useState(null);

    useEffect(() => {
      axios.get("")
    },[]);
  
  
    const handleFileUpload = async () => {
      try {
        if (!selectedFile) {
          console.error('Please select a file.');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        const response = await axios.get('http://localhost:5173/file/display', {
          headers: { Authorization: localStorage.getItem('token') },
        });
  
        console.log('File uploaded successfully:', response.data);
  
        // Set the upload response in the state
        setUploadResponse(response.data);
  
        // Fetch files again to update the table
        fetchFiles();
      } catch (error) {
        console.error('Error uploading file:', error.response.data);
        // Set the upload response in the state even in case of an error
        setUploadResponse(error.response.data);
      }
    };
  
    const handleFileDelete = async (fileId) => {
      try {
        const response = await axios.delete(`http://localhost:3000/file/delete/${fileId}`, {
          headers: { Authorization: localStorage.getItem('token') },
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
        const response = await axios.get('http://localhost:3000/file/display', {
          headers: { Authorization: localStorage.getItem('token') },
        });
  
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error.response.data);
      }
    };
  
    useEffect(() => {
      console.log("hello");
      fetchFiles();
    }, []);
  
    return (
      <div>
        <Navbar />
        <VStack>
          <Box mt={10}>
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
                          {/* Add update file functionality as needed */}
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
  
  export default UserScreen;
  