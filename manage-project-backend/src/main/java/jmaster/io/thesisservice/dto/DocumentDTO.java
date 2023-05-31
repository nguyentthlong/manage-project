package jmaster.io.thesisservice.dto;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class DocumentDTO {
	private Integer id;
	
	private String title;
	
	private String document;
	
	private UserDTO user;
	
	@JsonIgnore
	private MultipartFile file;

}
