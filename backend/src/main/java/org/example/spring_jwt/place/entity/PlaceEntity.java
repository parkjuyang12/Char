package org.example.spring_jwt.place.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.spring_jwt.entity.UserEntity;

@Entity
@Setter
@Getter
public class PlaceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String placeTitle;
    private Double latitude;
    private Double longitude;
    private String placeImageURL;
    private Integer rating;
    private String placeDescription;


    @ManyToOne // 여러 PlaceDomain이 하나의 UserEntity와 연관될 수 있음
    @JoinColumn(name = "userid")    // 외래 키로 사용될 컬럼 이름
    private UserEntity user;

}
