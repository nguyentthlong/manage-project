package jmaster.io.thesisservice.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "major")
//@EqualsAndHashCode(callSuper = false)
public class Major {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "title")
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	private String image;

	@CreatedDate
	private Date createdAt;
	
	@ManyToOne
	private Faculty faculty;
	
	@ManyToOne
	private Student student;
	
	@ManyToOne
	private Teacher teacher;
}
