package com.suicidecheckers.controllers;
import java.util.Base64;
import java.util.Map;

import org.jpl7.Query;
import org.jpl7.Term;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @CrossOrigin
    @GetMapping("/")
    public ResponseEntity<String> index(@RequestParam String predicate) {
        Query query = new Query(new String(Base64.getDecoder().decode(predicate)));
        if (query.hasSolution()) {
            Map<String, Term> result = query.oneSolution();
            return ResponseEntity.ok(result.toString());
        }
        
        return ResponseEntity.badRequest().body("false");
    }
}