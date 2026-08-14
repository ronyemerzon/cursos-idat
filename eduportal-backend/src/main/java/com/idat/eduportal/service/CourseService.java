package com.idat.eduportal.service;

import com.idat.eduportal.dto.CourseDTO;
import com.idat.eduportal.model.Course;
import com.idat.eduportal.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseDTO::new)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> searchCourses(String query) {
        if (!StringUtils.hasText(query)) {
            return getAllCourses();
        }
        return courseRepository.findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(query, query)
                .stream()
                .map(CourseDTO::new)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category).stream()
                .map(CourseDTO::new)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId).stream()
                .map(CourseDTO::new)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + id));
        return new CourseDTO(course);
    }

    public CourseDTO createCourse(CourseDTO courseDTO) {
        if (courseRepository.existsByCode(courseDTO.getCode().trim().toUpperCase())) {
            throw new RuntimeException("Ya existe un curso con el código: " + courseDTO.getCode());
        }

        Course course = new Course(
                courseDTO.getTitle().trim(),
                courseDTO.getCode().trim().toUpperCase(),
                courseDTO.getDescription(),
                courseDTO.getCategory(),
                courseDTO.getInstructorId(),
                courseDTO.getInstructorName(),
                courseDTO.getCredits() != null ? courseDTO.getCredits() : 4,
                courseDTO.getMaxCapacity() != null ? courseDTO.getMaxCapacity() : 30,
                courseDTO.getEnrolledCount() != null ? courseDTO.getEnrolledCount() : 0,
                courseDTO.getStatus() != null ? courseDTO.getStatus() : "ACTIVO",
                courseDTO.getImageUrl() != null ? courseDTO.getImageUrl() : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
                courseDTO.getSchedule() != null ? courseDTO.getSchedule() : "Lun y Mie 19:00 - 21:00"
        );

        Course saved = courseRepository.save(course);
        return new CourseDTO(saved);
    }

    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + id));

        if (!course.getCode().equalsIgnoreCase(courseDTO.getCode())) {
            if (courseRepository.existsByCode(courseDTO.getCode().trim().toUpperCase())) {
                throw new RuntimeException("El código de curso ya está registrado en otro curso");
            }
            course.setCode(courseDTO.getCode().trim().toUpperCase());
        }

        course.setTitle(courseDTO.getTitle().trim());
        course.setDescription(courseDTO.getDescription());
        course.setCategory(courseDTO.getCategory());
        course.setInstructorId(courseDTO.getInstructorId());
        course.setInstructorName(courseDTO.getInstructorName());
        course.setCredits(courseDTO.getCredits());
        course.setMaxCapacity(courseDTO.getMaxCapacity());
        course.setStatus(courseDTO.getStatus());
        course.setSchedule(courseDTO.getSchedule());
        if (StringUtils.hasText(courseDTO.getImageUrl())) {
            course.setImageUrl(courseDTO.getImageUrl());
        }

        Course updated = courseRepository.save(course);
        return new CourseDTO(updated);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Curso no encontrado con ID: " + id);
        }
        courseRepository.deleteById(id);
    }

    public CourseDTO enrollStudent(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + id));

        if (course.getEnrolledCount() >= course.getMaxCapacity()) {
            throw new RuntimeException("No hay cupos disponibles en este curso");
        }

        course.setEnrolledCount(course.getEnrolledCount() + 1);
        Course updated = courseRepository.save(course);
        return new CourseDTO(updated);
    }
}
