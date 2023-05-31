	package jmaster.io.thesisservice.api;

import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.dto.UserDTO;
import jmaster.io.thesisservice.entity.LoginRequest;
import jmaster.io.thesisservice.entity.Role;
import jmaster.io.thesisservice.entity.User;
import jmaster.io.thesisservice.repository.RoleRepository;
import jmaster.io.thesisservice.repository.UserRepo;
import jmaster.io.thesisservice.service.JwtTokenService;
import jmaster.io.thesisservice.service.UserService;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.NoResultException;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserAPIController {
    @Autowired
    UserRepo userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtTokenService jwtTokenService;

    @Autowired
    UserService userService;
  
    @PostMapping("/user/signin")
        public ResponseDTO<String> login(@Valid @ModelAttribute LoginRequest loginRequest) {
    		System.out.println(loginRequest.getUsername());
    		System.out.println(loginRequest.getPassword());
            Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            return ResponseDTO.<String>builder().code(String.valueOf(HttpStatus.OK.value())).data(jwtTokenService.createToken(loginRequest.getUsername(),authentication.getAuthorities())).build();
//            return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
        }
    
    @PostMapping("/user/signup")
    public ResponseEntity<String> create(@ModelAttribute UserDTO userDTO) throws IllegalStateException, IOException {
    	User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        System.out.println(userDTO.toString());
        user.setPassword(encoder.encode(userDTO.getPassword()));
        user.setPhoneNumber(userDTO.getPhoneNumber());
        if(userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
			final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = userDTO.getFile().getOriginalFilename();
//			String extension = filename.substring(filename.lastIndexOf("."));
//			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + filename);
			userDTO.getFile().transferTo(newFile);
			user.setAvatar(filename);
		}
        Set<Role> strRoles = new HashSet<>();
        strRoles.add(roleRepository.findById(1).orElseThrow(null));
        user.setRoles(strRoles);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
		
	}
    
    @GetMapping("user/download/{filename}")
	public void download(@PathVariable("filename") String filename, HttpServletResponse response) throws IOException {
		final String UPLOAD_FOLDER = "D:/file/user/";
		File file = new File(UPLOAD_FOLDER + filename);
		Files.copy(file.toPath(), response.getOutputStream());
	}
    
    @PutMapping("/user/update")
    public ResponseEntity<?>  update(@Valid @ModelAttribute UserDTO userDTO) throws IllegalStateException, IOException {
        User user = userRepository.findById(userDTO.getId()).orElseThrow(NoResultException::new);
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        System.out.println(userDTO.toString());
        user.setPassword(encoder.encode(userDTO.getPassword()));
        user.setPhoneNumber(userDTO.getPhoneNumber());
        if(userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
			final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = userDTO.getFile().getOriginalFilename();
//			String extension = filename.substring(filename.lastIndexOf("."));
//			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + filename);
			userDTO.getFile().transferTo(newFile);
			user.setAvatar(filename);
		}
        Set<Role> strRoles = new HashSet<>();
        strRoles.add(roleRepository.findById(1).orElseThrow(null));
        user.setRoles(strRoles);
        userRepository.save(user);

        return ResponseEntity.ok("User updated successfully!");
    }
    
    @PostMapping("/user/search")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<List<UserDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return userService.searchByTitle(searchDTO);
    }
    
    @GetMapping("/user/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public ResponseDTO<UserDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<UserDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(userService.get(id)).build();
    }

    
    @DeleteMapping("/user/delete/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        userService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/user/{ids}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        userService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/user/count")
    public Long countUsers() {
        return userService.countUsers();
    }

    @GetMapping("/user/count/{gender}")
    public int countUsersByGender(@PathVariable("gender") String gender){
        return userService.countUsersByGender(gender);
    }

}
