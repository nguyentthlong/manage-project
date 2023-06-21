package jmaster.io.thesisservice.dto;

import javax.persistence.Id;

import lombok.Data;

@Data
public class EvaluationDTO {
	
	private Integer id;
	
	private String description;
	
	private Double mark;
	
	private StudentDTO student;
	
	private TeacherDTO teacher;
	
	private ThesisDTO thesis;
}
