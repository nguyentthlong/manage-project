package jmaster.io.thesisservice.api;

import jmaster.io.thesisservice.entity.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<TeacherDTO> create(@RequestBody @Valid TeacherDTO teacherDTO) throws IOException {
    teacherService.create(teacherDTO);
    return ResponseDTO.<TeacherDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(teacherDTO).build();
}

@PutMapping("/teacher/")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<Void> update(@RequestBody @Valid TeacherDTO teacherDTO) throws IOException {
    teacherService.update(teacherDTO);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@GetMapping("/teacher/{id}")
//@PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
public ResponseDTO<TeacherDTO> get(@PathVariable(value = "id") int id) {
    return ResponseDTO.<TeacherDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
            .data(teacherService.get(id)).build();
}

@DeleteMapping("/teacher/delete/{id}")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
    teacherService.delete(id);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@DeleteMapping("/teacher/{ids}")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
    teacherService.deleteAll(ids);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}


@PostMapping("/teacher/search")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<List<TeacherDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    return teacherService.searchByTitle(searchDTO);

}

    //Tổng số giáo viên
    @GetMapping("/teacher/count")
    public ResponseEntity<Page<Long>> countTeachers(Pageable pageable) {
        Page<Long> countPage = teacherService.countTeachers(pageable);
        return ResponseEntity.ok(countPage);
    }

    //Đếm số lượng giáo viên theo khoa
    @GetMapping("/teacher/count/{facultyID}")
    public ResponseDTO<Page<Long>> countTeachersByFaculty(
            @PathVariable int facultyID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size )
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<Long> result = teacherService.countTeachersByFaculty(facultyID, pageable);
        return ResponseDTO.<Page<Long>>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .data(result)
                .totalElements(result.getTotalElements())
                .numberOfElements((long) result.getNumberOfElements())
                .totalPages((long) result.getTotalPages())
                .build();
    }

    //Lấy danh sách giáo viên theo khoa và phân trang
    @GetMapping("/teacher/statistic/{facultyID}")
    public ResponseDTO<Page<Teacher>> getTeachersByFaculty(
            @PathVariable int facultyID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Teacher> teachers = teacherService.getTeachersByFaculty(facultyID, pageable);

        return ResponseDTO.<Page<Teacher>>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .data(teachers)
                .totalElements(teachers.getTotalElements())
                .numberOfElements((long) teachers.getNumberOfElements())
                .totalPages((long) teachers.getTotalPages())
                .build();
    }


}