package org.example.spring_jwt.place.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoadPlaceDTO {
    private List<PlaceDTO> poi;
}
