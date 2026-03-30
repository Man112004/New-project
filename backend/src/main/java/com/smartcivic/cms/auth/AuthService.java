package com.smartcivic.cms.auth;

import com.smartcivic.cms.auth.dto.AuthResponse;
import com.smartcivic.cms.auth.dto.LoginRequest;
import com.smartcivic.cms.auth.dto.RegisterRequest;
import com.smartcivic.cms.common.Role;
import com.smartcivic.cms.common.exception.BadRequestException;
import com.smartcivic.cms.security.JwtService;
import com.smartcivic.cms.user.User;
import com.smartcivic.cms.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByPhone(request.phone())) {
            throw new BadRequestException("Phone is already registered");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase());
        user.setPhone(request.phone());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setCity(request.city());
        user.setRole(Role.CITIZEN);
        userRepository.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtService.generateToken(user, Map.of("role", user.getRole().name(), "userId", user.getId()));
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCity());
    }
}
