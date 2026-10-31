package com.campusconnect.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@Tag(name = "Files", description = "File storage and retrieval endpoints")
public class FileController {

    private final Path uploadDir = Paths.get("uploads/resumes").toAbsolutePath().normalize();

    @GetMapping("/{filename:.+}")
    @Operation(summary = "Download or view an uploaded file (e.g., student resume)")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            // Prevent path traversal attacks
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            Path filePath = uploadDir.resolve(filename).normalize();
            if (!filePath.startsWith(uploadDir)) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                String contentType = "application/octet-stream";
                if (filename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
