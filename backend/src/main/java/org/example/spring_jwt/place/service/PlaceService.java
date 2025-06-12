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
        place.setPer_price(placeDTO.getPer_price());
        place.setChar_type(placeDTO.getChar_type());
        place.setPlay_time(placeDTO.getPlay_time());
        place.setUser(user);
        place.setMax_car(placeDTO.getMax_car());

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

        // --- 이 부분이 핵심 수정입니다! ---
        // entity의 실제 char_type 값을 가져와야 합니다.
        dto.setChar_type(entity.getChar_type()); // entity.getChar_type()이 이미 String이라면 String.valueOf는 불필요
        // null 체크는 getter 내부에서 처리하거나, String.valueOf(obj)로 안전하게 변환
        // 만약 getChar_type()이 null일 가능성이 있다면, String.valueOf()로 감싸는 것이 안전.
        // 예: dto.setChar_type(String.valueOf(entity.getChar_type()));

        // entity의 실제 play_time 값을 가져와야 합니다.
        dto.setPlay_time(entity.getPlay_time()); // entity.getPlay_time()이 이미 String이라면 String.valueOf는 불필요
        // 예: dto.setPlay_time(String.valueOf(entity.getPlay_time()));

        dto.setPer_price(entity.getPer_price());

        // entity의 실제 max_car 값을 가져와야 합니다.
        dto.setMax_car(String.valueOf(entity.getMax_car())); // getMax_car()가 int/Integer라면 String.valueOf로 변환 (프론트에서 String으로 받으므로)
        // --- 수정 끝 ---

        return dto;
    }
}
