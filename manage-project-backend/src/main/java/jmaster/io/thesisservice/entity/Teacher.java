package jmaster.io.thesisservice.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jmaster.io.thesisservice.dto.FacultyDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(callSuper = false)
public class Teacher extends CreateAuditable{
	@Id
	private Integer id;

	@Column(unique = true)
	@NotBlank
	@Size(max = 20)
	private String teacherCode;

//	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
//	@JoinTable(name = "tutors_levels", joinColumns = @JoinColumn(name = "tutor_id"), inverseJoinColumns = @JoinColumn(name = "level_id"))
//	private Set<Level> levels = new HashSet<>();

	@OneToOne(cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	@MapsId
	private User user;
	
	@ManyToOne		
	private Faculty faculty;
	
	@CreatedDate
	private Date createdAt;
		
}
