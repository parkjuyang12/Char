package org.example.spring_jwt.controller;

import org.example.spring_jwt.dto.MemberDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

//@Controller
//@ResponseBody
@RestController
public class  MainController {
    @GetMapping("/")
    public MemberDTO mainP() {
        MemberDTO memberDTO = new MemberDTO();

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();

        memberDTO.setUsername(username);
        memberDTO.setRole(role);

        return memberDTO;
//        return "main Controller"+username+"_"+role;
//        Map<String, String> response = new HashMap<>();
//        response.put("username", username);
//        response.put("role", role);
//
//        System.out.println(response);
//
//
//        return response;
    }
}
