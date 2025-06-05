package org.example.spring_jwt.article.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.spring_jwt.entity.UserEntity;

@Entity
@Setter
@Getter
public class ArticleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String Title;
    private String Content;

    @ManyToOne  // 여러 게시글이 한 사용자(UserEntity)를 참조 가능
    @JoinColumn(name = "author_id")  // 외래 키 칼럼 이름
    private UserEntity author;
}
