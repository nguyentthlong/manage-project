package jmaster.io.thesisservice.dto;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class UserDTO {
    private Integer id;

    private String username;

    private String password;

	private String fullname;
    
	private String address;
	
    @JsonFormat(pattern = "dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
	private Date birthdate;
	
	private String gender;
	
    private String avatar;
        
    private String phoneNumber;
    
    private String email;
    
    @JsonIgnore
	private MultipartFile file;
    
    private List<RoleDTO> roles ;
}
