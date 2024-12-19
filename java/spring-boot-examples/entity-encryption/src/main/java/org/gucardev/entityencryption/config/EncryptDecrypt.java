package org.gucardev.entityencryption.config;


import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.gucardev.entityencryption.util.EncryptDecryptUtil;
import org.springframework.context.annotation.Configuration;

@Configuration
@Converter
public class EncryptDecrypt implements AttributeConverter<String, String> {

    private final EncryptDecryptUtil encryptDecryptUtil;

    public EncryptDecrypt(EncryptDecryptUtil encryptDecryptUtil) {
        this.encryptDecryptUtil = encryptDecryptUtil;
    }

    @Override
    public String convertToDatabaseColumn(String s) {
        return encryptDecryptUtil.encrypt(s);
    }

    @Override
    public String convertToEntityAttribute(String s) {
        return encryptDecryptUtil.decrypt(s);
    }
}
