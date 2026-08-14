package com.idat.eduportal.service;

import com.idat.eduportal.dto.UserDTO;
import com.idat.eduportal.model.Role;
import com.idat.eduportal.model.User;
import com.idat.eduportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    public List<UserDTO> searchUsers(String query) {
        if (!StringUtils.hasText(query)) {
            return getAllUsers();
        }
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)
                .stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return new UserDTO(user);
    }

    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail().trim().toLowerCase())) {
            throw new RuntimeException("El correo electrónico ya está registrado: " + userDTO.getEmail());
        }

        String rawPassword = StringUtils.hasText(userDTO.getPassword()) ? userDTO.getPassword() : "Idat2026*";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = new User(
                userDTO.getName().trim(),
                userDTO.getEmail().trim().toLowerCase(),
                encodedPassword,
                userDTO.getRole(),
                userDTO.getStatus() != null ? userDTO.getStatus() : "ACTIVO",
                userDTO.getAvatar() != null ? userDTO.getAvatar() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + userDTO.getName(),
                userDTO.getPhone()
        );

        User saved = userRepository.save(user);
        return new UserDTO(saved);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Si cambia de email, validar duplicado
        if (!user.getEmail().equalsIgnoreCase(userDTO.getEmail())) {
            if (userRepository.existsByEmail(userDTO.getEmail().trim().toLowerCase())) {
                throw new RuntimeException("El correo electrónico ya está en uso por otro usuario");
            }
            user.setEmail(userDTO.getEmail().trim().toLowerCase());
        }

        user.setName(userDTO.getName().trim());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.getStatus() != null ? userDTO.getStatus() : user.getStatus());
        user.setPhone(userDTO.getPhone());
        if (StringUtils.hasText(userDTO.getAvatar())) {
            user.setAvatar(userDTO.getAvatar());
        }

        // Si enviaron nueva contraseña, actualizarla
        if (StringUtils.hasText(userDTO.getPassword())) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        User updated = userRepository.save(user);
        return new UserDTO(updated);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserDTO toggleStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        String newStatus = "ACTIVO".equalsIgnoreCase(user.getStatus()) ? "INACTIVO" : "ACTIVO";
        user.setStatus(newStatus);
        User updated = userRepository.save(user);
        return new UserDTO(updated);
    }
}
