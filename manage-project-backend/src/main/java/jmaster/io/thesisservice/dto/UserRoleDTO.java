package jmaster.io.thesisservice.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UserRoleDTO {
    private Integer id;
    private Integer userId;
    private String userName;
    @NotBlank
    @Size(max=120)
    private String role; // ADMIN, MEMBER

}
