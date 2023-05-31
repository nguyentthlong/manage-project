package jmaster.io.thesisservice.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class MajorDTO {
	private Integer id;
    private String title;
    private String description;
    private String image;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;
    
    private FacultyDTO faculty;
        
    private StudentDTO student;
}
