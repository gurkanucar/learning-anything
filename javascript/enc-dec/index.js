// index.js
const crypto = require('crypto');

class CryptoManager {
    constructor(password) {
        // Create SHA-256 hash of the password, 64 hex chars
        this.passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
        
        // Use first 32 hex characters => 16 bytes
        const keyHex = this.passwordHash.slice(0, 32);

        // Convert hex => 16-byte Buffer
        this.secretKey = Buffer.from(keyHex, 'hex');
    }

    getPasswordHash() {
        return this.passwordHash;
    }

    encrypt(input) {
        try {
            // AES-128-ECB with PKCS#7 padding (Node automatically uses PKCS#7)
            const cipher = crypto.createCipheriv('aes-128-ecb', this.secretKey, null);
            let encrypted = cipher.update(input, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        } catch (error) {
            throw new Error(`Error encrypting data: ${error.message}`);
        }
    }

    decrypt(encryptedInput) {
        try {
            const decipher = crypto.createDecipheriv('aes-128-ecb', this.secretKey, null);
            let decrypted = decipher.update(encryptedInput, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            throw new Error(`Error decrypting data: ${error.message}`);
        }
    }
}

// Example usage
const password = "mySecretPasswordVeryLongTextASdasdqweasdThisIsLongTExtttt";
const originalText = "Hello World! broo";

const cryptoManager = new CryptoManager(password);

console.log("Original Text:", originalText);
console.log("Password Hash:", cryptoManager.getPasswordHash());

// Encrypt
const encrypted = cryptoManager.encrypt(originalText);
console.log("Encrypted:", encrypted);

// Decrypt
const decrypted = cryptoManager.decrypt(encrypted);
console.log("Decrypted:", decrypted);
