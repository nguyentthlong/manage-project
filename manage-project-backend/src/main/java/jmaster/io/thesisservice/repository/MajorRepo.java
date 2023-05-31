package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jmaster.io.thesisservice.entity.Major;

@Repository
public interface MajorRepo extends JpaRepository<Major, Integer> {
	@Query("SELECT m FROM Major m  where m.title like :x ")
    Page<Major> searchByTitle(@Param("x") String s, Pageable pageable);

    @Modifying
    @Query("delete from Major m where m.faculty.id = :fid")
    public void deleteByFacultyId(@Param("fid") int facultyId);
}
