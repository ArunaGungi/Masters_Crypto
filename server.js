const fs = require('fs');
const https = require('https');
const express = require('express');
const crypto = require('crypto');
const authRouter = require('./routes/authRoutes');
const fileRouter = require('./routes/fileRoutes');
const connectToMongoDB = require('./utils/dbConnection');
const keygenRouter = require('./routes/keygenRoutes');
const cors = require("cors");

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());


// Load DH parameters and keys
const dhparamPath = process.env.DHPARAM_PATH || 'utils/dhparam.pem';
const privateKeyPath = process.env.PRIVATE_KEY_PATH || 'utils/server-key.pem';
const certKeyPath = process.env.CERT_KEY_PATH || 'utils/cert.pem';

// Read files asynchronously and handle errors
const dhparam = fs.readFileSync(dhparamPath);
const privateKey = fs.readFileSync(privateKeyPath);
const passphrase = process.env.PASSPHRASE || 'cryptopassword';
const certKey = fs.readFileSync(certKeyPath);

const serverDH = crypto.createDiffieHellman(2048); //generates public key

const serverPublicKey = serverDH.generateKeys('base64');

app.use((req, res, next) => {
  res.locals.publicKey = serverPublicKey;
  next();
});

// Use Express routers for better organization

app.use('/auth', authRouter);
app.use('/file', fileRouter);
app.use('/key', keygenRouter);

const options = {
  key: privateKey,
  cert: certKey,
  dhparam,
  passphrase
};

// Create an HTTPS server with the express app
const server = https.createServer(options, app);

const PORT = process.env.PORT || 5173;

connectToMongoDB();

server.on('error', (error) => {
  console.error("error while setting up the server", error);
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
