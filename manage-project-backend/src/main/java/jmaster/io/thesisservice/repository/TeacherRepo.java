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
	
	@Query("SELECT t FROM Teacher t JOIN t.user u WHERE u.username LIKE :name")
	Page<Teacher> searchByName(@Param("name") String name, Pageable pageable);
	
//	Optional<Tutor> findByTutorCode(String code);

	@Query("SELECT t FROM Teacher t WHERE t.id = :x")
	Teacher getTutorById(@Param("x") Integer id);

	//Tổng số giáo viên
	@Query("SELECT COUNT(t) FROM Teacher t")
	Page<Long> countTeachers(Pageable pageable);

	//Đếm số lượng giáo viên theo khoa
	@Query("SELECT COUNT(t) FROM Teacher t WHERE t.faculty.id = :facultyID")
	Page<Long> countTeachersByFaculty(@Param("facultyID") int facultyID, Pageable pageable);

	//Lấy danh sách giáo viên theo khoa và phân trang
	@Query("SELECT t FROM Teacher t WHERE t.faculty.id = :facultyID")
	Page<Teacher> getTeachersByFaculty(@Param("facultyID") int facultyID, Pageable pageable);
}
