package jmaster.io.thesisservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jmaster.io.thesisservice.entity.User;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

	// y doan nay la tim theo ten chua tu khoa dung k hay la tim chinh xac nhi
	// chứa từ khóa ạ :v the thi them %% vao nhu kia la dc
	
    @Query("SELECT u FROM User u WHERE u.username LIKE :x ")
    Page<User> searchByName(@Param("x") String s, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.username LIKE :name ")
    Page<User> find(@Param("name") String value, Pageable pageable);

    @Query("SELECT id from User")
    Page<User> findAllIds(Pageable pageable);
    
    //User findByUsername(String username);

    //Tổng số người dùng
    @Query("SELECT COUNT(u) FROM User u")
    Page<User> countUsers(Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u")
    Long countUsers();

    //Thống kê theo giới tính
    @Query("SELECT COUNT(u) FROM User u WHERE u.gender = :gender")
    int countUsersByGender(@Param("gender") String gender);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
