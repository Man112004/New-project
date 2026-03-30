package com.smartcivic.cms.config;

import com.smartcivic.cms.common.Role;
import com.smartcivic.cms.department.Department;
import com.smartcivic.cms.department.DepartmentRepository;
import com.smartcivic.cms.user.User;
import com.smartcivic.cms.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-email}")
    private String adminEmail;

    @Value("${app.seed.admin-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            departmentRepository.saveAll(List.of(
                    department("Roads and Infrastructure", "Bengaluru"),
                    department("Solid Waste Management", "Bengaluru"),
                    department("Street Lighting", "Pune"),
                    department("Water Supply and Drainage", "Hyderabad")
            ));
        }
        userRepository.findByEmail(adminEmail.toLowerCase()).orElseGet(() -> {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail(adminEmail.toLowerCase());
            admin.setPhone("9876543210");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setCity("Bengaluru");
            return userRepository.save(admin);
        });
    }

    private Department department(String name, String city) {
        Department department = new Department();
        department.setName(name);
        department.setCity(city);
        return department;
    }
}
