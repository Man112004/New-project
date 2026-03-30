package com.smartcivic.cms.department;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    public List<Department> list(@RequestParam(required = false) String city) {
        return city == null || city.isBlank() ? departmentRepository.findAll() : departmentRepository.findByCityIgnoreCase(city);
    }
}
