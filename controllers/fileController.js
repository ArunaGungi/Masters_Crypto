
const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const crypto = require("crypto");
class FileController {
  async upload(req, res) {
    try {
      const { originalname, path } = req.file;
      const existingFile = await File.findOne({ filename: originalname });
      if (existingFile) {
        console.log('File with the same filename already exists:', originalname);
        res.status(409).json({ status: 'error', message: 'File with the same filename already exists' });
      }
      // Read the file content
      const buffer = await fs.promises.readFile(path);
      // Generate a random IV (Initialization Vector)
      const iv = crypto.randomBytes(12);
      const sharedKey = Buffer.from(process.env.sharedSecretKey, 'hex');
      
      // Create an AES-GCM cipher with a random key and IV
      const cipher = crypto.createCipheriv('aes-256-gcm', sharedKey, iv);
      // Update the cipher with the file content and finalize it
      const encryptedContent = Buffer.concat([cipher.update(buffer), cipher.final()]);
      // Get the authentication tag
      const tag = cipher.getAuthTag();
      // Store the encrypted file content, IV, and tag in MongoDB
      const newFile = await File.create({
        filename: originalname,
        content: encryptedContent.toString('hex'), // Convert to hex for storage
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        path: path
      });
      // Remove the uploaded file after reading its content
      // await fs.promises.unlink(path);
      res.status(201).json({
        status: 'success',
        message: 'File uploaded and encrypted successfully',
        file: newFile,
      });
    } catch (error) {
      console.error('Error during file upload:', error);
      res.status(500).json({ status: 'error', message: error });
    }
  }
  async display(req, res) {
    try {
      // Fetch all files from the database
      const allFiles = await File.find();
      // // Check if there are no files
      // if (!allFiles || allFiles.length === 0) {
      //   console.log('No files found');
      //   res.status(200).json({ });
      //   return;
      // }
      // Extract relevant information for display
      const fileData = allFiles.map((file) => ({
        _id: file._id,
        filename: file.filename,
        createdAt: file.createdAt, // Assuming you have a createdAt field in your schema
      }));
      res.status(200).json({
        status: 'success',
        message: 'Files retrieved successfully',
        files: fileData,
      });
    } catch (error) {
      console.error('Error during file retrieval:', error);
      res.status(500).json({ status: 'error', message: error });
    }
  }
  async delete(req, res) {
    try {
      const fileId = req.params.id;
      const file = await File.findByIdAndDelete(fileId);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      const filePath = file.path;
      await fs.promises.unlink(filePath);
      res.json({ message: 'File deleted successfully', file });
    } catch (error) {
      console.error('Error during file deletion:', error);
      res.status(500).send(error);
    }
  }
  async download(req, res) {
    try {
      const { filename } = req.params;
      const file = await File.findOne({ filename });
  
      if (!file) {
        return res.status(404).json({ status: 'error', message: 'File not found' });
      }
        
      const iv = Buffer.from(file.iv, 'hex');
      const tag = Buffer.from(file.tag, 'hex');
      const sharedKey = Buffer.from(process.env.sharedSecretKey, 'hex');
  
      const decipher = crypto.createDecipheriv('aes-256-gcm', sharedKey, iv);
      decipher.setAuthTag(tag);
  
      const encryptedContent = Buffer.from(file.content, 'hex');
      const decryptedContent = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
  
      res.status(200).send(decryptedContent);
    } catch (error) {
      console.error('Error during file download:', error);
      res.status(500).json({ status: 'error', message: 'Error during file download', error: error.message });
    }
  }
  
}
module.exports = new FileController();
