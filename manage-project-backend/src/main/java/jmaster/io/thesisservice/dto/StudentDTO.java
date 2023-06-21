package jmaster.io.thesisservice.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import jmaster.io.thesisservice.entity.Classes;
import jmaster.io.thesisservice.entity.User;
import lombok.Data;

@Data
public class StudentDTO {
	 @NotNull
	 private Integer id;
	 @NotBlank
	 @Size(max=20)
	 private String studentCode;
	 
	 private UserDTO user;
	 
	 private MajorDTO major;
	 
	 private ClassesDTO studentClass;
}
