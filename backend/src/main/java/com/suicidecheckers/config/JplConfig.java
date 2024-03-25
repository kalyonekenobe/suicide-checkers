package com.suicidecheckers.config;

import org.jpl7.Query;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class JplConfig {

    @PostConstruct
    public void initializeJpl() {
        try {
          Query query = new Query("consult('suicide-checkers.pl')");

        if (query.hasSolution()) {
            System.out.println("Prolog file consulted successfully.");
        } else {
            System.out.println("Failed to consult Prolog file.");
        } 
      } catch (Exception exception) {
        exception.printStackTrace();
      }
    }
}