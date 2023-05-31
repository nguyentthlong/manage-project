package jmaster.io.thesisservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import jmaster.io.thesisservice.entity.Role;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role,Integer> {
        Optional<Role> findByName(String username);
}