package org.example.spring_jwt.place.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.spring_jwt.entity.UserEntity;

@Getter
@Setter
public class PlaceDTO {
    private String placeTitle;
    private String placeDescription;
    private Double latitude;
    private Double longitude;
    private String placeImageURL;
    private Integer per_price;
    private int userId;
    private int placeId;
    private String play_time;
    private String char_type;
    private String max_car;
}
