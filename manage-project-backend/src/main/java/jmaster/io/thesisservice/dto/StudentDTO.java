package jmaster.io.thesisservice.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jmaster.io.thesisservice.entity.User;
import lombok.Data;

@Data
public class StudentDTO {
	 @NotNull
	 private Integer id;
	 @NotBlank
	 @Size(max=20)
	 private String studentCode;

	@JsonBackReference //tranh loop vo han, nếu để bên entity sẽ chặn show user
	 private UserDTO user;
	 
	 private MajorDTO major;
	 
}
