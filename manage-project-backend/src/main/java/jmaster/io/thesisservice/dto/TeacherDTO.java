package jmaster.io.thesisservice.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class TeacherDTO {
	@NotNull
    private Integer id;
    @NotBlank
    @Size(max=20)
    private String teacherCode;
    
    private UserDTO user;
    
    private FacultyDTO faculty;
}
