package com.example.crudproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.crudproject.entity.Student;

public interface StudentRepository extends JpaRepository<Student,Integer> {

}
