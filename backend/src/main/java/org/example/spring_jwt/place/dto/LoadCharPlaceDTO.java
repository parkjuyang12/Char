package org.example.spring_jwt.place.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoadCharPlaceDTO {
    private List<ChargingDTO> poi;
}
