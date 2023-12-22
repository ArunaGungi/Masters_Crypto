const crypto = require('crypto');

const encryptAesGcm = (dataOrFilePath, key) => {
  const iv = crypto.randomBytes(12); // Initialization Vector for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);

  let dataBuffer;

  if (typeof dataOrFilePath === 'string') {
    // Input is a string
    dataBuffer = Buffer.from(dataOrFilePath, 'utf-8');
  } else if (fs.existsSync(dataOrFilePath)) {
    // Input is a file path
    dataBuffer = fs.readFileSync(dataOrFilePath);
  } else {
    throw new Error('Invalid input data. It should be a string or a valid file path.');
  }

  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encryptedContent: encrypted.toString('hex'), iv, tag };
};


// Function to decrypt data using AES-GCM
function decrypt(encrypted, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    Buffer.from(encrypted.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));
  let decrypted = decipher.update(encrypted.encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

module.exports = { encryptAesGcm, decrypt };
