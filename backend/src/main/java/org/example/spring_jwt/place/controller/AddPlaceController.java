package org.example.spring_jwt.place.controller;

import org.example.spring_jwt.place.dto.PlaceDTO;
import org.example.spring_jwt.place.service.PlaceService;
import org.example.spring_jwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;


@RestController
@RequestMapping("/api/place")
//@RequiredArgsConstructor
public class AddPlaceController {

    private final PlaceService placeService;
    private final UserRepository userRepository;

    public AddPlaceController(PlaceService placeService, UserRepository userRepository) {
        this.placeService = placeService;
        this.userRepository = userRepository;
    }
    // 장소 등록 API
    @Value("${spring.my.path}")
    private String basePath;
    @PostMapping("/add")
    public ResponseEntity<String> addPlace(
            @RequestParam("placeTitle") String placeTitle,
            @RequestParam("lat") Double latitude,
            @RequestParam("lng") Double longitude,
            @RequestParam("per_price") Integer per_price,
            @RequestParam("placeDescription") String placeDescription,
            @RequestParam("placeImageURL") MultipartFile imageFile,
            @RequestParam("char_type") String char_type,
            @RequestParam("play_time") String play_time,
            @RequestParam("max_car") String max_car) throws IOException {

        PlaceDTO placeDTO = new PlaceDTO();



//        String path = "/Users/mingyun/Desktop/project/spring_jwt/src/main/java/org/example/spring_jwt/place/image/"+imageFile.getOriginalFilename();
        String path = basePath+imageFile.getOriginalFilename();
        imageFile.transferTo(new File(path));

        placeDTO.setPlaceTitle(placeTitle);
        placeDTO.setLatitude(latitude);
        placeDTO.setLongitude(longitude);
        placeDTO.setPlaceImageURL(path);
        placeDTO.setPer_price(per_price);
        placeDTO.setPlaceDescription(placeDescription);
        placeDTO.setChar_type(char_type);
        placeDTO.setPlay_time(play_time);
        placeDTO.setMax_car(max_car);

        System.out.println("Adding place " + placeDTO.getPlaceImageURL());

        placeService.addPlaceProcess(placeDTO);
        return ResponseEntity.ok("장소가 성공적으로 등록되었습니다.");
    }
}
