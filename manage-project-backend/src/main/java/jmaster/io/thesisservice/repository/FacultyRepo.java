package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jmaster.io.thesisservice.entity.Faculty;

@Repository
public interface FacultyRepo extends JpaRepository<Faculty,Integer> {
    @Query("SELECT f FROM Faculty f WHERE f.name LIKE :name ")
    Page<Faculty> find(@Param("name") String value, Pageable pageable);

}
