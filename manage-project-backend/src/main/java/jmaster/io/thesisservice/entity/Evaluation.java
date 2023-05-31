package jmaster.io.thesisservice.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.Data;

@Data
@Entity
public class Evaluation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String description;

	private Float mark;
	
	@ManyToOne
	private Student student;
	
	@ManyToOne
	private Teacher teacher;
	
	@ManyToOne
	private Thesis thesis;
}
