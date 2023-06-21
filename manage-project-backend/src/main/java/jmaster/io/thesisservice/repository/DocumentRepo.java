package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jmaster.io.thesisservice.entity.Document;


public interface DocumentRepo extends JpaRepository<Document, Integer>{
	@Query("SELECT d FROM Document d  where d.title like :x ")
    Page<Document> searchByTitle(@Param("x") String s, Pageable pageable);
	
	@Query("SELECT d FROM Document d JOIN  d.user u WHERE u.username = :uusername AND d.title like :x")
	Page<Document> searchDocumentByUserId(@Param("uusername") String username, @Param("x") String s,  Pageable pageable); 
	
	@Modifying
    @Query("delete from Document d where d.user.id = :uid")
    public void deleteByUserId(@Param("uid") int userId);
}
