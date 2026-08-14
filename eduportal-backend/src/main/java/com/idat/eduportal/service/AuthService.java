package com.idat.eduportal.service;

import com.idat.eduportal.config.JwtTokenProvider;
import com.idat.eduportal.dto.JwtResponse;
import com.idat.eduportal.dto.LoginRequest;
import com.idat.eduportal.dto.UserDTO;
import com.idat.eduportal.model.User;
import com.idat.eduportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public JwtResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim().toLowerCase();
        String rawPassword = loginRequest.getPassword() != null ? loginRequest.getPassword().trim() : "";

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("El correo '" + email + "' no está registrado en el sistema"));

        // Permitir validación con BCrypt o texto plano de respaldo (por si se insertó manualmente en SQL Server)
        boolean passwordMatches = passwordEncoder.matches(rawPassword, user.getPassword()) || rawPassword.equals(user.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Contraseña incorrecta para el usuario " + email);
        }

        // Si la contraseña estaba en texto plano en la BD, encriptarla automáticamente a BCrypt
        if (rawPassword.equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }

        if ("INACTIVO".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("La cuenta del usuario está inactiva. Contacte al administrador.");
        }

        String token = tokenProvider.generateToken(user);
        return new JwtResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getAvatar()
        );
    }

    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return new UserDTO(user);
    }
}
