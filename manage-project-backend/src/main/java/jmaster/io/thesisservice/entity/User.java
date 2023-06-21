package jmaster.io.thesisservice.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "user")
@EqualsAndHashCode(callSuper = false)
public class User extends CreateAuditable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String username;

	private String password;

	private String fullname;
	
	private String address;
	
	private Date birthdate;
	
	private String gender;
	
	private String avatar; // URL

	@Column(name = "email", unique = true)
	private String email;

	@Column(name = "phoneNumber", unique = true)
	private String phoneNumber;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private List<Role> roles = new ArrayList<>();

	@OneToOne(mappedBy = "user")
	private Student student;

	@OneToOne(mappedBy = "user")
	private Teacher teacher;

}
