package com.idat.eduportal.repository;

import com.idat.eduportal.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);
    List<Course> findByCategory(String category);
    List<Course> findByStatus(String status);
    List<Course> findByInstructorId(Long instructorId);
    List<Course> findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(String title, String code);
}
