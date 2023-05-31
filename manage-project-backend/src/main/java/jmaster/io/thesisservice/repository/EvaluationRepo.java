package jmaster.io.thesisservice.repository;

import jmaster.io.thesisservice.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jmaster.io.thesisservice.entity.Evaluation;
import jmaster.io.thesisservice.entity.Faculty;

public interface EvaluationRepo extends JpaRepository<Evaluation,Integer>{
	@Query("SELECT e FROM Evaluation e where e.description like :x")
    Page<Evaluation> searchByDescription(@Param("x") String s, Pageable pageable);
	
	@Modifying
    @Query("delete from Evaluation e where e.student.id = :sid")
    public void deleteByStudentId(@Param("sid") int studentId);
	
	@Modifying
    @Query("delete from Evaluation e where e.teacher.id = :tid")
    public void deleteByTeacherId(@Param("tid") int studentId);
	
	@Modifying
    @Query("delete from Evaluation e where e.thesis.id = :tid")
    public void deleteByThesisId(@Param("tid") int studentId);

    //Tổng số đánh giá
    @Query("SELECT COUNT(e) FROM Evaluation e")
    Page<Long> countEvaluations(Pageable pageable);

    //Thống kê đánh giá theo điểm
    @Query("SELECT AVG(e.mark) AS average, MAX(e.mark) AS max, MIN(e.mark) AS min FROM Evaluation e")
    Double[] getEvaluationStatistics();

    @Query("SELECT e.student FROM Evaluation e GROUP BY e.student ORDER BY AVG(e.mark) DESC")
    Page<Student> findStudentByMark(Pageable pageable);

    //Lấy điểm cao nhất trong tất cả các đánh giá và show thông tin teacher, student, thsis liên quan
    @Query("SELECT e.mark AS maxMark, s, t, thesis FROM Evaluation e JOIN e.student s JOIN e.teacher t JOIN e.thesis thesis WHERE e.mark = (SELECT MAX(e2.mark) FROM Evaluation e2) " )
    Page<Object[]> findHighestMark(Pageable pageable);
}
