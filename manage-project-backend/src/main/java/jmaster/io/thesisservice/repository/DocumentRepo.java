package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jmaster.io.thesisservice.entity.Document;
import jmaster.io.thesisservice.entity.Student;
import jmaster.io.thesisservice.entity.Thesis;

public interface DocumentRepo extends JpaRepository<Document, Integer>{
	@Query("SELECT d FROM Document d  where d.title like :x ")
    Page<Document> searchByTitle(@Param("x") String s, Pageable pageable);
	
	@Modifying
    @Query("delete from Document d where d.user.id = :uid")
    public void deleteByUserId(@Param("uid") int userId);

    // Tổng số tài liệu
    @Query("SELECT COUNT(d) FROM Document d")
    Page<Long> countDocuments(Pageable pageable);

    // Thống kê tài liệu theo người dùng
//    @Query("SELECT u.username, COUNT(d) FROM User u JOIN u.documents d GROUP BY u.username")
//    Page<Object[]> countDocumentsByUser(Pageable pageable);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.user.id = :userID")
    Page<Long> countDocumentsByUserID(@Param("userID") int userID, Pageable pageable);

    //Lấy danh sách tài liệu theo studentCode và phân trang:
    @Query("SELECT d FROM Document d JOIN d.user u JOIN u.student s WHERE s.studentCode = :studentCode")
    Page<Document> getDocumentsByStudentCode(@Param("studentCode") String studentCode, Pageable pageable);


    //Lấy danh sách tài liệu theo người dùng và phân trang:
//    @Query("SELECT d FROM Document d WHERE d.user.username = :username")
//    Page<Document> getDocumentsByUser(@Param("username") String username, Pageable pageable);
}
