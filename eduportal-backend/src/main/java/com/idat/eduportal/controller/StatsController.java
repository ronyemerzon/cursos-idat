package com.idat.eduportal.controller;

import com.idat.eduportal.dto.ApiResponse;
import com.idat.eduportal.model.Role;
import com.idat.eduportal.repository.CourseRepository;
import com.idat.eduportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalStudents = userRepository.findByRole(Role.ROLE_ESTUDIANTE).size();
        long totalProfessors = userRepository.findByRole(Role.ROLE_PROFESOR).size();
        long totalAdmins = userRepository.findByRole(Role.ROLE_ADMIN).size();
        long totalCourses = courseRepository.count();
        long activeCourses = courseRepository.findByStatus("ACTIVO").size();

        stats.put("totalUsers", totalUsers);
        stats.put("totalStudents", totalStudents);
        stats.put("totalProfessors", totalProfessors);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalCourses", totalCourses);
        stats.put("activeCourses", activeCourses);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
