//package org.example.spring_jwt.article.controller;
//
//import lombok.RequiredArgsConstructor;
//import org.example.spring_jwt.article.dto.ArticleResponse;
//import org.example.spring_jwt.place.service.PlaceService;
//import org.example.spring_jwt.repository.UserRepository;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api")
//public class ArticleController {
//
//    private final PlaceService placeService;
//    private final UserRepository userRepository;
//
//
//    @GetMapping("/public/article/id/{articleId}")
//    public ResponseEntity<ArticleResponse> findById(@PathVariable Long boardId) {
//        return ResponseEntity.ok(ArticleReadService.findById(boardId));
//    }
//    @PatchMapping("/public/articles/{articleId}")
//    public ResponseEntity<Void> update(@Valid @RequestBody ArticleUpdateRequest request,
//                                       @PathVariable Long boardId) {
//        ArticleService.update(request.toEntity(), boardId, getPrincipal().getId());
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/boards/{boardsId}")
//    public ResponseEntity<Void> delete(@PathVariable Long boardsId) {
//        ArticleService.delete(boardsId, getPrincipal().getId());
//        return ResponseEntity.noContent().build();
//    }
//}
