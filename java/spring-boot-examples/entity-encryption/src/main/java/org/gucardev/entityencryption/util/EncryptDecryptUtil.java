package org.gucardev.entityencryption.util;


import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class EncryptDecryptUtil {

    private final String key;
    private final String algo;

    public EncryptDecryptUtil(
        @Value("${encryption.key}") String key,
        @Value("${encryption.algorithm}") String algo) {
        this.key = key;
        this.algo = algo;
    }

    /**
     * Encrypt the input value using AES algorithm.
     * @param value The plaintext value to encrypt.
     * @return Encrypted value in Base64, or null if encryption fails.
     */
    public String encrypt(String value) {
        if (value == null || key == null || algo == null) {
            log.warn("Encryption failed: value, key, or algorithm is null.");
            return null;
        }
        try {
            Cipher cipher = initCipher(Cipher.ENCRYPT_MODE);
            if (cipher == null) return null;

            byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception ex) {
            log.error("Error occurred during encryption", ex);
        }
        return null;
    }

    /**
     * Decrypt the input value using AES algorithm.
     * @param encrypted The encrypted value in Base64 to decrypt.
     * @return Decrypted plaintext, or null if decryption fails.
     */
    public String decrypt(String encrypted) {
        if (encrypted == null || key == null || algo == null) {
            log.warn("Decryption failed: encrypted value, key, or algorithm is null.");
            return null;
        }
        try {
            Cipher cipher = initCipher(Cipher.DECRYPT_MODE);
            if (cipher == null) return null;

            byte[] decoded = Base64.getDecoder().decode(encrypted);
            byte[] original = cipher.doFinal(decoded);
            return new String(original, StandardCharsets.UTF_8);
        } catch (Exception ex) {
            log.error("Error occurred during decryption", ex);
        }
        return null;
    }

    /**
     * Initialize the Cipher instance for encryption or decryption.
     * @param mode Cipher.ENCRYPT_MODE or Cipher.DECRYPT_MODE.
     * @return Initialized Cipher or null if initialization fails.
     */
    private Cipher initCipher(int mode) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance(algo);
            cipher.init(mode, keySpec);
            return cipher;
        } catch (Exception ex) {
            log.error("Error initializing Cipher with mode: {}", mode, ex);
        }
        return null;
    }
}
