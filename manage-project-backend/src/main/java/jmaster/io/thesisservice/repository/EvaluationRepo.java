package jmaster.io.thesisservice.repository;

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
}
