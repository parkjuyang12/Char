package org.example.spring_jwt.place.dto;

import lombok.Data;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class ChargingDTO {
    private String statId;
    private String statNm;
    private String address;
    private double lat;
    private double lng;
    private String busiNm;
    private String busiCall;
}

