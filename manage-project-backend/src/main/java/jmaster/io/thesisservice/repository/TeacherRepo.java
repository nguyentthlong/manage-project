package jmaster.io.thesisservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jmaster.io.thesisservice.entity.Teacher;

@Repository
public interface TeacherRepo extends JpaRepository<Teacher, Integer>{	
	//JPA Criteria
	@Query("SELECT t.id FROM Teacher t")
	List<Integer> findAllId();
	
	Page<Teacher> findByIdIn(List<Integer> ids,  Pageable pageable);
	
	@Query("SELECT t FROM Teacher t JOIN t.user u WHERE u.fullname LIKE :name")
	Page<Teacher> searchByName(@Param("name") String name, Pageable pageable);
	
//	Optional<Tutor> findByTutorCode(String code);
	
	
	@Query("SELECT t FROM Teacher t WHERE t.id = :x")
	Teacher getTutorById(@Param("x") Integer id);
}
