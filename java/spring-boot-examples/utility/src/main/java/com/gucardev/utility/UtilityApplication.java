package com.gucardev.utility;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@Slf4j
@EnableAspectJAutoProxy(proxyTargetClass = true)
@SpringBootApplication
public class UtilityApplication {

    private static final String MAIN_PACKAGE_NAME = UtilityApplication.class.getPackageName();

    public static void main(String[] args) {
        SpringApplication.run(UtilityApplication.class, args);
    }

    public static String getMainPackageName() {
        return MAIN_PACKAGE_NAME;
    }

}
