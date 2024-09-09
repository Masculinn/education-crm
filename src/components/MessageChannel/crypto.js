import CryptoJS from "crypto-js";

// Check if the environment variable is correctly set
const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

console.log(encryptionKey);
if (!encryptionKey || encryptionKey.length !== 64) {
  console.warn(
    "Encryption key length is not 32 bytes (64 hex characters). Ensure the key is secure and matches AES-256 requirements."
  );
}

// Parse the encryption key from a hex string to a WordArray
const parsedKey = CryptoJS.enc.Hex.parse(encryptionKey);

// Function to encrypt a message
const encrypt = (message) => {
  try {
    // Encrypt the message using AES
    const cipherText = CryptoJS.AES.encrypt(message, parsedKey).toString(); // Convert to Base64 string
    return cipherText;
  } catch (error) {
    console.error("Error encrypting message:", error);
    return null;
  }
};

// Function to decrypt a message
const decrypt = (cipherText) => {
  try {
    // Decrypt the cipher text
    const bytes = CryptoJS.AES.decrypt(cipherText, parsedKey);
    // Convert decrypted data to a UTF-8 string
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting message:", error);
    return null;
  }
};

export { encrypt, decrypt };
