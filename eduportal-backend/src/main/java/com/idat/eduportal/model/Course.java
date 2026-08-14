package com.idat.eduportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category; // Frontend, Backend, Base de Datos, Móvil, Cloud, DevOps, IA

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "instructor_name", length = 100)
    private String instructorName;

    @Column(nullable = false)
    private Integer credits = 4;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity = 30;

    @Column(name = "enrolled_count", nullable = false)
    private Integer enrolledCount = 0;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVO"; // ACTIVO, INACTIVO, FINALIZADO

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(length = 100)
    private String schedule; // Lun - Mie 19:00 - 21:00

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Course() {
        this.createdAt = LocalDateTime.now();
    }

    public Course(String title, String code, String description, String category, Long instructorId,
                  String instructorName, Integer credits, Integer maxCapacity, Integer enrolledCount,
                  String status, String imageUrl, String schedule) {
        this.title = title;
        this.code = code;
        this.description = description;
        this.category = category;
        this.instructorId = instructorId;
        this.instructorName = instructorName;
        this.credits = credits != null ? credits : 4;
        this.maxCapacity = maxCapacity != null ? maxCapacity : 30;
        this.enrolledCount = enrolledCount != null ? enrolledCount : 0;
        this.status = status != null ? status : "ACTIVO";
        this.imageUrl = imageUrl;
        this.schedule = schedule;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
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
