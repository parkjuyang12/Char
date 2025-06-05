package org.example.spring_jwt.article.repository;


import org.example.spring_jwt.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<UserEntity, Integer> {
    Boolean existsByUsername(String username);
    UserEntity findByUsername(String username);
    int findIdByUsername(String username);
}

