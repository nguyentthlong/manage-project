package jmaster.io.thesisservice.dto;

import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class ThesisDTO {
	private Integer id;
	
	private String title;
	
	private String description;

	private String status;

	@JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
	private Date startDate;
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
	private Date endDate;
	
	private TeacherDTO teacher;
	
	private StudentDTO student;
}
