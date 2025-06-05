package org.example.spring_jwt.place.repository;

import org.example.spring_jwt.place.entity.ChargingStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStationEntity, String> {

    @Query(value = """
        SELECT *,
        (6371 * acos(
            cos(radians(:lat)) * cos(radians(c.latitude)) * cos(radians(c.longitude) - radians(:lng)) +
            sin(radians(:lat)) * sin(radians(c.latitude))
        )) AS distance
        FROM charging_station c  
        WHERE
            (6371 * acos(
                cos(radians(:lat)) * cos(radians(c.latitude)) * cos(radians(c.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(c.latitude))
            )) < :radius
        ORDER BY distance
        """, nativeQuery = true)
    List<ChargingStationEntity> findNearbyCharPlaces(@Param("lat") double lat,
                                                     @Param("lng") double lng,
                                                     @Param("radius") double radius);
}