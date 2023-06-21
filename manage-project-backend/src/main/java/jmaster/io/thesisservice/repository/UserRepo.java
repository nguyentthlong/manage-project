package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jmaster.io.thesisservice.entity.User;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

    @Query("SELECT u FROM User u WHERE u.fullname LIKE :x ")
    Page<User> searchByName(@Param("x") String s, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.username LIKE :name ")
    Page<User> find(@Param("name") String value, Pageable pageable);

    @Query("SELECT id from User")
    Page<User> findAllIds(Pageable pageable);
    
    //User findByUsername(String username);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
