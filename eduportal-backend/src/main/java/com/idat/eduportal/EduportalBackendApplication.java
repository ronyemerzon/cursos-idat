package com.idat.eduportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EduportalBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduportalBackendApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println(">>> EDUPORTAL BACKEND SPRING BOOT INICIADO CON EXITO <<<");
        System.out.println(">>> API Base URL: http://localhost:8080/api           <<<");
        System.out.println(">>> H2 Console:  http://localhost:8080/h2-console     <<<");
        System.out.println("=======================================================\n");
    }
}
