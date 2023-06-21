package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jmaster.io.thesisservice.entity.Classes;
import jmaster.io.thesisservice.entity.Document;


public interface ClassesRepo extends JpaRepository<Classes, Integer> {
	@Query("SELECT c FROM Classes c  where c.name like :x ")
    Page<Classes> searchByTitle(@Param("x") String s, Pageable pageable);
	
}
