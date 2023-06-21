package jmaster.io.thesisservice.api;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.RoleDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.dto.UserDTO;
import jmaster.io.thesisservice.entity.LoginRequest;
import jmaster.io.thesisservice.entity.Role;
import jmaster.io.thesisservice.repository.RoleRepo;
import jmaster.io.thesisservice.repository.UserRepo;
import jmaster.io.thesisservice.service.JwtTokenService;
import jmaster.io.thesisservice.service.RoleService;
import jmaster.io.thesisservice.service.UserService;

@RestController
@RequestMapping("/api")
public class UserAPIController {
	@Autowired
	UserRepo userRepository;
	@Autowired
	RoleRepo roleRepo;
	@Autowired
	AuthenticationManager authenticationManager;
	@Autowired
	PasswordEncoder encoder;
	@Autowired
	JwtTokenService jwtTokenService;

	@Autowired
	UserService userService;

	@Autowired
	RoleService roleService;
	
	@PostMapping("/user/signin")
	public ResponseDTO<String> login(@Valid @ModelAttribute LoginRequest loginRequest) {
		System.out.println(loginRequest.getUsername());
		System.out.println(loginRequest.getPassword());
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
		return ResponseDTO.<String>builder().code(String.valueOf(HttpStatus.OK.value()))
				.data(jwtTokenService.createToken(loginRequest.getUsername(), authentication.getAuthorities())).build();
//            return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
	}
	
	@GetMapping("/me")
	@PreAuthorize("isAuthenticated()")
	public ResponseDTO<UserDTO> me(Principal principal) {
		String username = principal.getName();
		
		return ResponseDTO.<UserDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
				.data(userService.getUserByUsername(username)).build();
	}

	@PostMapping("/user/add")
	public ResponseEntity<String> create(@ModelAttribute UserDTO userDTO) throws IllegalStateException, IOException {
		if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
			final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = userDTO.getFile().getOriginalFilename();
			String extension = filename.substring(filename.lastIndexOf("."));
			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + newFilename);
			userDTO.getFile().transferTo(newFile);
			userDTO.setAvatar(newFilename);

		}
		userService.create(userDTO);
		return ResponseEntity.ok("User added successfully!");
	}

	@PostMapping("/user/signup")
	public ResponseEntity<String> signup(@ModelAttribute UserDTO userDTO) throws IllegalStateException, IOException {
		if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
			final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = userDTO.getFile().getOriginalFilename();
			String extension = filename.substring(filename.lastIndexOf("."));
			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + newFilename);
			userDTO.getFile().transferTo(newFile);
			userDTO.setAvatar(newFilename);
		}
		userService.signup(userDTO);
		return ResponseEntity.ok("User registered successfully!");
	}
	
	@GetMapping("/user/statistic")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public  ResponseDTO<Long> countThesis() {
        return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
        		.data(userService.countUser()).build();
    }
	
	@GetMapping("user/download/{filename}")
	public void download(@PathVariable("filename") String filename, HttpServletResponse response) throws IOException {
		final String UPLOAD_FOLDER = "D:/file/user/";
		File file = new File(UPLOAD_FOLDER + filename);
		Files.copy(file.toPath(), response.getOutputStream());
	}

//    @GetMapping("download/file")
//    public ResponseEntity<byte[]> downloadFile(String fileName) {
//        String filePath = new StringBuilder("D:/file/user/").append(fileName).toString();
//    	
//    	try {
//            ClassPathResource resource = new ClassPathResource(filePath);
//            
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.setContentDispositionFormData("attachment", fileName);
//            
//            return ResponseEntity.ok()
//                    .headers(headers)
//                    .body(resource.getInputStream().readAllBytes());
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.notFound().build();
//        }
//    }

	@PutMapping("/user/update")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	public ResponseEntity<String> update(@Valid @ModelAttribute UserDTO userDTO)
			throws IllegalStateException, IOException {
		if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
			final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = userDTO.getFile().getOriginalFilename();
			String extension = filename.substring(filename.lastIndexOf("."));
			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + newFilename);
			userDTO.getFile().transferTo(newFile);
			userDTO.setAvatar(newFilename);
		}
		userService.update(userDTO);
		return ResponseEntity.ok("User updated successfully!");
	}

	@PostMapping("/user/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseDTO<List<UserDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
		return userService.searchByTitle(searchDTO);
	}

	@GetMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STUDENT', 'ROLE_TEACHER')")
	public ResponseDTO<UserDTO> get(@PathVariable(value = "id") int id) {
		return ResponseDTO.<UserDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(userService.get(id))
				.build();
	}

	@DeleteMapping("/user/delete/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
		userService.delete(id);
		return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
	}

	@DeleteMapping("/user/{ids}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
		userService.deleteAll(ids);
		return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
	}

}
