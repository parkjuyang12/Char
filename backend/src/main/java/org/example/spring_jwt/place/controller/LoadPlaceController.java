package org.example.spring_jwt.place.controller;

import org.example.spring_jwt.place.dto.LoadCharPlaceDTO;
import org.example.spring_jwt.place.dto.LoadPlaceDTO;
import org.example.spring_jwt.place.dto.PlaceDTO;
import org.example.spring_jwt.place.service.ChargingService;
import org.example.spring_jwt.place.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class LoadPlaceController {
    private final PlaceService placeService;
    private final ChargingService chargingService;
    public LoadPlaceController(PlaceService placeService, ChargingService chargingService) {
        this.placeService = placeService;
        this.chargingService = chargingService;
    }

    @GetMapping("/load_location")
    public ResponseEntity<LoadPlaceDTO> loadLocation(@RequestParam double lat, @RequestParam double lng) {
        System.out.println("Loading location");
        System.out.println("latitude: " + lat);
        System.out.println("longitude: " + lng);

        LoadPlaceDTO response = placeService.findNearbyLocations(lat, lng);
        System.out.println(response);
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/load_location")
//    public ResponseEntity<LoadCharPlaceDTO> loadCharLocation(@RequestParam double lat, @RequestParam double lng) {
//        System.out.println("Loading location");
//        System.out.println("latitude: " + lat);
//        System.out.println("longitude: " + lng);
//
//        LoadCharPlaceDTO response = chargingService.findCharNearbyLocations(lat, lng);
//        System.out.println(response);
//        return ResponseEntity.ok(response);
//    }
//



}
