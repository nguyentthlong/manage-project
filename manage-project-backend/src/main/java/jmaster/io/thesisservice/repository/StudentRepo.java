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
	
	@Query("SELECT st FROM Student st JOIN st.user u WHERE u.username LIKE :name")
	Page<Student> searchByName(@Param("name") String name, Pageable pageable);
	
//	Optional<Student> findByStudentCode(String code);
	
	@Query("SELECT s FROM Student s WHERE s.id = :x")
	Student getStudentById(@Param("x") Integer id);

	//Thống kê số lượng sinh viên theo Mã sinh viên
	@Query("SELECT COUNT(s) FROM Student s WHERE s.studentCode LIKE CONCAT('%', :studentCode, '%')")
	Long countStudentsByStudentCode(@Param("studentCode") String studentCode);

	//Tổng số sinh viên
	@Query("SELECT COUNT(s) FROM Student s")
	Page<Long> countStudents(Pageable pageable);

	//Đếm số lượng sinh viên theo ngành học
	@Query("SELECT COUNT(s) FROM Student s WHERE s.major.id = :majorID")
	Page<Long> countStudentsByMajor(@Param("majorID") int majorID, Pageable pageable);

	//Lấy danh sách sinh viên theo ngành học và phân trang:
	@Query("SELECT s FROM Student s WHERE s.major.id = :majorID")
	Page<Student> getStudentsByMajor(@Param("majorID") int majorID, Pageable pageable);
}
