package jmaster.io.thesisservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
public class UserDTO {
    private Integer id;

    private String username;

    private String password;

    private String avatar;
        
    private String phoneNumber;
    
    private String email;

    private String fullName;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private Date dateOfBirth;

    private String gender;

    private String address;
    
    @JsonIgnore
	private MultipartFile file;

    private Set<RoleDTO> roles ;
}
