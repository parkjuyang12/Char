package org.example.spring_jwt.place.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "charging_station")
public class ChargingStationEntity {

    @Id
    private String stationId;

    private String name;

    private String address;

    private double latitude;

    private double longitude;

    private String operatorName;

    private String operatorTel;
}