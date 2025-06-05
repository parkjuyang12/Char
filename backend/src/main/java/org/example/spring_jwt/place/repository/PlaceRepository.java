package org.example.spring_jwt.place.repository;

import org.example.spring_jwt.place.entity.PlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaceRepository extends JpaRepository<PlaceEntity, Integer> {

@Query(value = """
    SELECT *, 
    (6371 * acos(
        cos(radians(:lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:lng)) +
        sin(radians(:lat)) * sin(radians(latitude))
    )) AS distance
    FROM place_entity
    WHERE 
        (6371 * acos(
            cos(radians(:lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:lng)) +
            sin(radians(:lat)) * sin(radians(latitude))
        )) < :radius
    ORDER BY distance
    """, nativeQuery = true)
    List<PlaceEntity> findNearbyPlaces(@Param("lat") double lat,
                                       @Param("lng") double lng,
                                       @Param("radius") double radius);


}
