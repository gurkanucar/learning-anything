package com.gucardev;

public class Main {
    public static void main(String[] args) {
        String password1 = "mySecretPasswordVeryLongTextASdasdqweasdThisIsLongTExtttt";
        String originalText = "Hello World!";

        // Encrypt with password1
        String encrypted1 = CryptoManager.encrypt(password1, originalText);
        System.out.println("Encrypted with password1: " + encrypted1);

        // Decrypt with password1
        String decrypted1 = CryptoManager.decrypt(password1, encrypted1);
        System.out.println("Decrypted with password1: " + decrypted1);

    }
}
