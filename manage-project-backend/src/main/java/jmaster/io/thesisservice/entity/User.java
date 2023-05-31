package jmaster.io.thesisservice.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


@Data
@Entity
@Table(name = "user")
//@EntityListeners(AuditingEntityListener.class)
//@EqualsAndHashCode(callSuper = false)
public class User{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String username;

	private String password;

	@Column(name = "avatar")
	private String avatar; // URL
	
	@Column(name = "email", unique = true)
	private String email;

	@Column(name = "phoneNumber", unique = true)
	private String phoneNumber;

	@Column(name = "FullName")
	private String fullName;

	@Temporal(TemporalType.DATE)
	@Column(name = "DateOfBirth")
	private Date dateOfBirth;

	@Column(name = "Gender")
	private String gender;

	@Column(name = "Address")
	private String address;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
			name = "users_roles",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "role_id")
	)
	private Set<Role> roles = new HashSet<>();
	
	@OneToOne(mappedBy = "user", fetch = FetchType.EAGER)
	@JsonIgnore //tranh loop vo han
	private Student student;
	
	@OneToOne(mappedBy = "user", fetch = FetchType.EAGER)
	@JsonIgnore
	private Teacher teacher;
}
