package jmaster.io.thesisservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jmaster.io.thesisservice.dto.*;
import jmaster.io.thesisservice.service.StudentService;
import jmaster.io.thesisservice.utils.FileStore;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentAPIController {
@Autowired
private StudentService studentService;

@PostMapping("/student/")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<StudentDTO> create(@RequestBody @Valid StudentDTO studentDTO) throws IOException {
    studentService.create(studentDTO);
    return ResponseDTO.<StudentDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(studentDTO).build();
}

@PutMapping("/student/update")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT')")
public ResponseDTO<Void> update(@RequestBody @Valid StudentDTO studentDTO) throws IOException {
    studentService.update(studentDTO);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@GetMapping("/student/{id}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
public ResponseDTO<StudentDTO> get(@PathVariable(value = "id") int id) {
    return ResponseDTO.<StudentDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
            .data(studentService.get(id)).build();
}

@DeleteMapping("/student/delete/{id}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
    studentService.delete(id);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@DeleteMapping("/student/{ids}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
    studentService.deleteAll(ids);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}


@PostMapping("/student/search")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
public ResponseDTO<List<StudentDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    return studentService.searchByTitle(searchDTO);
}

@GetMapping("/student/statistic")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
public  ResponseDTO<Long> countThesis() {
    return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
    		.data(studentService.countStudent()).build();
}

}