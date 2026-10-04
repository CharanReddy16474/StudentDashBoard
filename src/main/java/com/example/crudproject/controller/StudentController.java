package com.example.crudproject.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.crudproject.entity.Student;
import com.example.crudproject.repository.StudentRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController 
public class StudentController {

    @Autowired 
   StudentRepository repo;
        @GetMapping("/students")
        public List<Student> getAllStudents(){

            List<Student> students = repo.findAll();

            return students;
        }

         @GetMapping("/students/{id}")
         public Student getStudentById(@PathVariable  int id){
           Student student = repo.findById(id).get();
           return student;
         }

         @PostMapping("/student/add")
         @ResponseStatus (code = HttpStatus.CREATED)
         public void createStudent(@RequestBody Student student){
            repo.save(student);
         }

         @PutMapping("student/update/{id}")
            public void updateStudent(@RequestBody Student student, @PathVariable int id){
                Student existingStudent = repo.findById(id).get();
                existingStudent.setName(student.getName());
                existingStudent.setPercentage(student.getPercentage());
                existingStudent.setBranch(student.getBranch());
                repo.save(existingStudent);
            }
           
            @DeleteMapping ("/student/delete/{id}")
            public void deleteStudent(@PathVariable int id){
                repo.deleteById(id);
            }
         


       
        
}
