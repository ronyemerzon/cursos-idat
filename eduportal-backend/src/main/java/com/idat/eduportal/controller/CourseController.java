package com.idat.eduportal.controller;

import com.idat.eduportal.dto.ApiResponse;
import com.idat.eduportal.dto.CourseDTO;
import com.idat.eduportal.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        try {
            List<CourseDTO> courses;
            if (category != null && !category.isEmpty() && !"TODOS".equalsIgnoreCase(category)) {
                courses = courseService.getCoursesByCategory(category);
            } else {
                courses = courseService.searchCourses(search);
            }
            return ResponseEntity.ok(ApiResponse.ok(courses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getCourseById(@PathVariable Long id) {
        try {
            CourseDTO course = courseService.getCourseById(id);
            return ResponseEntity.ok(ApiResponse.ok(course));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        try {
            CourseDTO created = courseService.createCourse(courseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Curso creado exitosamente", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDTO courseDTO) {
        try {
            CourseDTO updated = courseService.updateCourse(id, courseDTO);
            return ResponseEntity.ok(ApiResponse.ok("Curso actualizado exitosamente", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(ApiResponse.ok("Curso eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<ApiResponse<CourseDTO>> enrollStudent(@PathVariable Long id) {
        try {
            CourseDTO enrolled = courseService.enrollStudent(id);
            return ResponseEntity.ok(ApiResponse.ok("Matrícula realizada con éxito", enrolled));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
