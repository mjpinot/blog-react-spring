package com.example.blog.post;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "${APP_CORS_ORIGINS:http://localhost:5173}")
public class PostController {
  private final PostRepository repository;

  public PostController(PostRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Post> list() {
    return repository.findAllByOrderByCreatedAtDesc();
  }

  @PostMapping
  public ResponseEntity<Post> create(@Valid @RequestBody PostRequest request) {
    Post post = repository.save(new Post(request.title(), request.author(), request.content()));
    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(post.getId())
            .toUri();

    return ResponseEntity.created(location).body(post);
  }
}
