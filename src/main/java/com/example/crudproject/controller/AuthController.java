package com.example.crudproject.controller;

import com.example.crudproject.dto.LoginRequest;
import com.example.crudproject.dto.LoginResponse;
import com.example.crudproject.dto.RegisterRequest;
import com.example.crudproject.entity.User;
import com.example.crudproject.repository.UserRepository;
import com.example.crudproject.security.JwtService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // ===============================
    // REGISTER
    // ===============================

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        // Check whether username already exists
        if (userRepository
                .findByUsername(request.getUsername())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");
        }

        // Create new user
        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Save user into database
        userRepository.save(user);

        return ResponseEntity.ok(
                "User registered successfully"
        );
    }

    // ===============================
    // LOGIN
    // ===============================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Generate JWT token
        String token =
                jwtService.generateToken(
                        request.getUsername()
                );

        return ResponseEntity.ok(
                new LoginResponse(token)
        );
    }
}