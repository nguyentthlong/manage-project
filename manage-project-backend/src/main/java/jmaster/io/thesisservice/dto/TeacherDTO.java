package jmaster.io.thesisservice.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

@Data
public class TeacherDTO {
	@NotNull
    private Integer id;
    @NotBlank
    @Size(max=20)
    private String teacherCode;

    @JsonBackReference //tranh loop vo han, nếu để bên entity sẽ chặn show user
    private UserDTO user;

    @JsonIgnore
    private FacultyDTO faculty;
}
