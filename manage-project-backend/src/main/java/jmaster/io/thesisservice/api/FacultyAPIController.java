package jmaster.io.thesisservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jmaster.io.thesisservice.dto.FacultyDTO;
import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.service.FacultyService;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FacultyAPIController {
    @Autowired
    private FacultyService facultyService;

    @PostMapping("/admin/faculty/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseDTO<FacultyDTO> create(@RequestBody @Valid FacultyDTO facultyDTO) throws IOException {
        // goi qua Service
        facultyService.create(facultyDTO);
        return ResponseDTO.<FacultyDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(facultyDTO).build();
    }

    @PutMapping("/admin/faculty/update")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseDTO<Void> update(@RequestBody @Valid FacultyDTO facultyDTO) throws IOException {
        facultyService.update(facultyDTO);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/admin/faculty/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    public ResponseDTO<FacultyDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<FacultyDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(facultyService.get(id)).build();
    }

    @DeleteMapping(value = "/admin/faculty/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        facultyService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/admin/faculty/deleteAll/{ids}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        facultyService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/admin/faculty/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    public ResponseDTO<List<FacultyDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return facultyService.find(searchDTO);
    }

    @GetMapping("/admin/faculty/statistic")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public  ResponseDTO<Long> countThesis() {
        return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
        		.data(facultyService.countFaculty()).build();
    }
}
