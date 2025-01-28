package com.gucardev;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.DigestUtils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class CryptoManager {

    // Generate the SecretKeySpec for the given password
    private static SecretKeySpec getKey(String password) {
        try {
            // 1) Generate SHA-256 hash (64 hex characters)
            String passwordHash = DigestUtils.sha256Hex(password);

            // 2) Take the first 32 hex characters => 16 bytes
            String keyHex = passwordHash.substring(0, 32);

            // 3) Decode from hex to a byte array
            byte[] keyBytes = Hex.decodeHex(keyHex);

            // 4) Create and return the AES key
            return new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            throw new RuntimeException("Error generating key from password", e);
        }
    }

    // Encrypt the input string using the given password
    public static String encrypt(String password, String input) {
        try {
            SecretKeySpec secretKey = getKey(password);

            // Use AES/ECB/PKCS5Padding
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);

            byte[] encryptedBytes = cipher.doFinal(input.getBytes(StandardCharsets.UTF_8));

            // Encode to Base64
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data", e);
        }
    }

    // Decrypt the encrypted string using the given password
    public static String decrypt(String password, String encryptedInput) {
        try {
            SecretKeySpec secretKey = getKey(password);

            // Use AES/ECB/PKCS5Padding
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);

            byte[] decodedBytes = Base64.getDecoder().decode(encryptedInput);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);

            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data", e);
        }
    }
}
