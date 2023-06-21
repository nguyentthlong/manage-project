package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jmaster.io.thesisservice.entity.Teacher;
import jmaster.io.thesisservice.entity.Thesis;

@Repository
public interface ThesisRepo extends JpaRepository<Thesis, Integer>{
	
	@Query("SELECT t FROM Thesis t  where t.title like :x ")
    Page<Thesis> searchByTitle(@Param("x") String s, Pageable pageable);
	
	@Modifying
    @Query("delete from Thesis t where t.student.id = :sid")
    public void deleteByStudentId(@Param("sid") int studentId);
	
	@Modifying
    @Query("delete from Thesis t where t.teacher.id = :tid")
    public void deleteByTeacherId(@Param("tid") int teacherId);
	
    //Thống kê đồ án theo trạng thái:
    @Query("SELECT COUNT(t) FROM Thesis t WHERE t.status = :status")
    Long  countThesisByStatus(@Param("status") String status);

    //Lấy danh sách đồ án theo trạng thái và phân trang
    @Query("SELECT t FROM Thesis t WHERE t.status = :status")
    Page<Thesis> getThesisByStatus(@Param("status") String status, Pageable pageable);
}
