package org.example.spring_jwt.place.service;

import org.example.spring_jwt.entity.UserEntity;
import org.example.spring_jwt.place.dto.LoadPlaceDTO;
import org.example.spring_jwt.place.dto.PlaceDTO;
import org.example.spring_jwt.place.entity.PlaceEntity;
import org.example.spring_jwt.place.repository.PlaceRepository;
import org.example.spring_jwt.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class PlaceService {
    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;

    public PlaceService(UserRepository userRepository, PlaceRepository placeRepository) {
        this.userRepository = userRepository;
        this.placeRepository = placeRepository;
    }

    public void addPlaceProcess(PlaceDTO placeDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        UserEntity user = userRepository.findByUsername(username);

        PlaceEntity place = new PlaceEntity();
        place.setPlaceTitle(placeDTO.getPlaceTitle());
        place.setPlaceDescription(placeDTO.getPlaceDescription());
        place.setLatitude(placeDTO.getLatitude());
        place.setLongitude(placeDTO.getLongitude());
        place.setPlaceImageURL(placeDTO.getPlaceImageURL());
        place.setRating(placeDTO.getRating());
        place.setUser(user);

        placeRepository.save(place);
    }

    public LoadPlaceDTO findNearbyLocations(double lat, double lng) {
        double radius = 30.0; // km 단위

        List<PlaceEntity> entities = placeRepository.findNearbyPlaces(lat, lng, radius);

        List<PlaceDTO> dtos = entities.stream().map(this::convertToDTO).toList();
        System.out.println("entities =");
        if (!entities.isEmpty()) {
            System.out.println(entities.get(0).getId());
        } else {
            System.out.println("No places found.");
        }

        LoadPlaceDTO response = new LoadPlaceDTO();
        response.setPoi(dtos);
        return response;
    }
    private PlaceDTO convertToDTO(PlaceEntity entity) {
        PlaceDTO dto = new PlaceDTO();
        dto.setPlaceTitle(entity.getPlaceTitle());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setPlaceId(entity.getId());
        dto.setPlaceImageURL(entity.getPlaceImageURL());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);
        return dto;
    }
}
