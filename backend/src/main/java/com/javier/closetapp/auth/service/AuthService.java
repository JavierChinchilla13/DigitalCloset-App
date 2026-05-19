package com.javier.closetapp.auth.service;

import com.javier.closetapp.auth.dto.AuthResponse;
import com.javier.closetapp.auth.dto.LoginRequest;
import com.javier.closetapp.auth.dto.RegisterRequest;
import com.javier.closetapp.security.JwtService;
import com.javier.closetapp.user.entity.User;
import com.javier.closetapp.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );
        
        User savedUser = userRepository.save(user);
        
        org.springframework.security.core.userdetails.User userDetails = 
                new org.springframework.security.core.userdetails.User(
                        savedUser.getEmail(),
                        savedUser.getPassword(),
                        new ArrayList<>()
                );
        
        String jwtToken = jwtService.generateToken(userDetails);
        
        return new AuthResponse(jwtToken, savedUser.getUserId(), savedUser.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        org.springframework.security.core.userdetails.User userDetails = 
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        new ArrayList<>()
                );
        
        String jwtToken = jwtService.generateToken(userDetails);
        
        return new AuthResponse(jwtToken, user.getUserId(), user.getEmail());
    }
}
