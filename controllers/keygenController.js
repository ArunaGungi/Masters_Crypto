const crypto = require('crypto');

let clientKeys = generateKeys();
let serverKeys = generateKeys();

function generateKeys() {
  const dh = crypto.createDiffieHellman(2048);
  dh.generateKeys();
  const publicKey = dh.getPublicKey('base64');
  const privateKey = dh.getPrivateKey('base64');
  return { dh, publicKey, privateKey };
}

const exchangePublicKeys = async (req, res) => {
  const response = {
    clientPublicKey: clientKeys.publicKey,
    serverPublicKey: serverKeys.publicKey,
  };

  res.json(response);
};

const generateRandomKey = () => {
  // Generate 8 random bytes (64 bits) and convert to a hexadecimal string
  return crypto.randomBytes(32).toString('hex');
};

const validateSecretKey = async (req, res) => {
  if (!clientKeys || !serverKeys) {
    return res.status(400).json({ error: 'Public keys not exchanged yet.' });
  }

  try {
    const clientDH = clientKeys.dh;
    const serverDH = serverKeys.dh;

    clientDH.setPrivateKey(clientKeys.privateKey, 'base64');
    serverDH.setPrivateKey(serverKeys.privateKey, 'base64');

    clientDH.setPublicKey(req.body.serverPublicKey, 'base64');
    serverDH.setPublicKey(req.body.clientPublicKey, 'base64');

    const sharedSecretFromClient = clientDH.computeSecret(serverDH.getPublicKey(), 'base64', 'hex');
    const sharedSecretFromServer = serverDH.computeSecret(clientDH.getPublicKey(), 'base64', 'hex');

    // Generate a 64-bit (8-byte) random secret key
    const generatedSecretKey = generateRandomKey();

    const result = crypto.timingSafeEqual(
      Buffer.from(sharedSecretFromClient, 'hex'),
      Buffer.from(sharedSecretFromClient, 'hex')
    );

    console.log("sharedSecretKey", sharedSecretFromClient);

    res.json({ result, generatedSecretKey });
  } catch (error) {
    console.error('Error computing shared secret:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  exchangePublicKeys,
  validateSecretKey,
};
