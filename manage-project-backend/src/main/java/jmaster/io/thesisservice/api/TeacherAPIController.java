package jmaster.io.thesisservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jmaster.io.thesisservice.dto.*;
import jmaster.io.thesisservice.service.TeacherService;
import jmaster.io.thesisservice.utils.FileStore;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TeacherAPIController {
@Autowired
private TeacherService teacherService;

@PostMapping("/teacher/")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<TeacherDTO> create(@RequestBody @Valid TeacherDTO teacherDTO) throws IOException {
    teacherService.create(teacherDTO);
    return ResponseDTO.<TeacherDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(teacherDTO).build();
}

@PutMapping("/teacher/update")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
public ResponseDTO<Void> update(@RequestBody @Valid TeacherDTO teacherDTO) throws IOException {
    teacherService.update(teacherDTO);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@GetMapping("/teacher/{id}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
public ResponseDTO<TeacherDTO> get(@PathVariable(value = "id") int id) {
    return ResponseDTO.<TeacherDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
            .data(teacherService.get(id)).build();
}

@DeleteMapping("/teacher/delete/{id}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
    teacherService.delete(id);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@DeleteMapping("/teacher/{ids}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
    teacherService.deleteAll(ids);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}


@PostMapping("/teacher/search")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
public ResponseDTO<List<TeacherDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    return teacherService.searchByTitle(searchDTO);

}

@GetMapping("/teacher/statistic")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
public  ResponseDTO<Long> countThesis() {
    return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
    		.data(teacherService.countTeacher()).build();
}

}