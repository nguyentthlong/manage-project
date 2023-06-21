package jmaster.io.thesisservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jmaster.io.thesisservice.dto.*;
import jmaster.io.thesisservice.service.ClassesService;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ClassesAPIController {
	
@Autowired
private ClassesService classesService;

@PostMapping("/classes/")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<ClassesDTO> create(@RequestBody @Valid ClassesDTO classesDTO) throws IOException {
    classesService.create(classesDTO);
    return ResponseDTO.<ClassesDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(classesDTO).build();
}

@PutMapping("/classes/update")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<Void> update(@RequestBody @Valid ClassesDTO classesDTO) throws IOException {
    classesService.update(classesDTO);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@GetMapping("/classes/{id}")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STUDENT', 'ROLE_TEACHER')")
public ResponseDTO<ClassesDTO> get(@PathVariable(value = "id") int id) {
    return ResponseDTO.<ClassesDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
            .data(classesService.get(id)).build();
}

@DeleteMapping("/classes/delete/{id}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
    classesService.delete(id);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@DeleteMapping("/classes/{ids}")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
    classesService.deleteAll(ids);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}


@PostMapping("/classes/search")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
public ResponseDTO<List<ClassesDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    return classesService.find(searchDTO);

}

@GetMapping("/classes/statistic")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
public ResponseDTO<Long> countThesis() {
    return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
            .data(classesService.countClasses()).build();
}
}
