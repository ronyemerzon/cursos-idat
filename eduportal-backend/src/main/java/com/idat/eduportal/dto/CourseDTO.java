package com.idat.eduportal.dto;

import com.idat.eduportal.model.Course;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CourseDTO {

    private Long id;

    @NotBlank(message = "El título del curso es obligatorio")
    private String title;

    @NotBlank(message = "El código del curso es obligatorio")
    private String code;

    private String description;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    private Long instructorId;
    private String instructorName;

    @NotNull(message = "Los créditos son obligatorios")
    private Integer credits = 4;

    @NotNull(message = "La capacidad máxima es obligatoria")
    private Integer maxCapacity = 30;

    private Integer enrolledCount = 0;
    private String status = "ACTIVO";
    private String imageUrl;
    private String schedule;
    private LocalDateTime createdAt;

    public CourseDTO() {}

    public CourseDTO(Course course) {
        this.id = course.getId();
        this.title = course.getTitle();
        this.code = course.getCode();
        this.description = course.getDescription();
        this.category = course.getCategory();
        this.instructorId = course.getInstructorId();
        this.instructorName = course.getInstructorName();
        this.credits = course.getCredits();
        this.maxCapacity = course.getMaxCapacity();
        this.enrolledCount = course.getEnrolledCount();
        this.status = course.getStatus();
        this.imageUrl = course.getImageUrl();
        this.schedule = course.getSchedule();
        this.createdAt = course.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Integer getEnrolledCount() {
        return enrolledCount;
    }

    public void setEnrolledCount(Integer enrolledCount) {
        this.enrolledCount = enrolledCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
