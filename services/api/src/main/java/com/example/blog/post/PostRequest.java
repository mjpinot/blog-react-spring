package com.example.blog.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(
    @NotBlank @Size(max = 160) String title,
    @NotBlank @Size(max = 100) String author,
    @NotBlank @Size(max = 5000) String content) {}
