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
    private Integer rating;
    private int userId;
    private int placeId;
}
