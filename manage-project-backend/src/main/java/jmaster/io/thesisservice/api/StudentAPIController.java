package jmaster.io.thesisservice.api;

import jmaster.io.thesisservice.entity.Student;
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
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<StudentDTO> create(@RequestBody @Valid StudentDTO studentDTO) throws IOException {
    studentService.create(studentDTO);
    return ResponseDTO.<StudentDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(studentDTO).build();
}

@PutMapping("/student/")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<Void> update(@RequestBody @Valid StudentDTO studentDTO) throws IOException {
    studentService.update(studentDTO);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@GetMapping("/student/{id}")
//@PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
public ResponseDTO<StudentDTO> get(@PathVariable(value = "id") int id) {
    return ResponseDTO.<StudentDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
            .data(studentService.get(id)).build();
}

@DeleteMapping("/student/delete/{id}")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
    studentService.delete(id);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}

@DeleteMapping("/student/{ids}")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
    studentService.deleteAll(ids);
    return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
}


@PostMapping("/student/search")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseDTO<List<StudentDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    return studentService.searchByTitle(searchDTO);
}

    //Thống kê số lượng sinh viên theo Mã sinh viên
    @GetMapping("/student/search")
    public Long countStudentsByStudentCode(@RequestParam("studentCode") String studentCode) {
        return studentService.countStudentsByStudentCode(studentCode);
    }

    @GetMapping("/student/count")
    public ResponseEntity<Page<Long>> countStudents(Pageable pageable) {
        Page<Long> countPage = studentService.countStudents(pageable);
        return ResponseEntity.ok(countPage);
    }

    //Đếm số lượng sinh viên theo ngành học
    @GetMapping("/student/count/{majorID}")
    public ResponseDTO<Page<Long>> countStudentsByMajor(
            @PathVariable int majorID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size )
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<Long> result = studentService.countStudentsByMajor(majorID, pageable);
        return ResponseDTO.<Page<Long>>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .data(result)
                .totalElements(result.getTotalElements())
                .numberOfElements((long) result.getNumberOfElements())
                .totalPages((long) result.getTotalPages())
                .build();
    }

    //Lấy danh sách sinh viên theo ngành học và phân trang:
    @GetMapping("/student/statistic/{majorID}")
    public ResponseDTO<Page<Student>> getStudentsByMajor(
            @PathVariable int majorID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> students = studentService.getStudentsByMajor(majorID, pageable);

        return ResponseDTO.<Page<Student>>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .data(students)
                .totalElements(students.getTotalElements())
                .numberOfElements((long) students.getNumberOfElements())
                .totalPages((long) students.getTotalPages())
                .build();
    }

}