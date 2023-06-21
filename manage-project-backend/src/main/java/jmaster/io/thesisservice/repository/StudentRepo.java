package jmaster.io.thesisservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jmaster.io.thesisservice.entity.Student;

@Repository
public interface StudentRepo extends JpaRepository<Student, Integer>{	
	//JPA Criteria
	@Query("SELECT st.id FROM Student st")
	List<Integer> findAllId();
	
	Page<Student> findByIdIn(List<Integer> ids,  Pageable pageable);
	
	@Query("SELECT st FROM Student st JOIN st.user u WHERE u.fullname LIKE :name")
	Page<Student> searchByName(@Param("name") String name, Pageable pageable);
	
//	Optional<Student> findByStudentCode(String code);

	
	@Query("SELECT s FROM Student s WHERE s.id = :x")
	Student getStudentById(@Param("x") Integer id);
}
