package org.example.spring_jwt.controller;

import org.example.spring_jwt.dto.JoinDTO;
import org.example.spring_jwt.dto.ResponseDTO;
import org.example.spring_jwt.service.JoinService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JoinController {
    private final JoinService joinService;
    public JoinController(JoinService joinService) {
        this.joinService = joinService;
    }

    @PostMapping("/join")
    public ResponseDTO JoinProcess(@RequestBody JoinDTO joinDTO) {
        System.out.println("hello im ID"+joinDTO.getUsername());
        System.out.println(joinDTO.getPassword());
        joinService.joinProcess(joinDTO);
        return new ResponseDTO("ok");
    }
}
