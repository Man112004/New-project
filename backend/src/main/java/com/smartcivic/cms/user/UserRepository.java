package com.smartcivic.cms.user;

import com.smartcivic.cms.common.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<User> findByRole(Role role);
    List<User> findByRoleAndCityIgnoreCase(Role role, String city);
}
