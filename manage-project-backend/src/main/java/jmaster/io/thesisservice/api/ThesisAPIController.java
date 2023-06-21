package jmaster.io.thesisservice.api;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.dto.ThesisDTO;
import jmaster.io.thesisservice.entity.Thesis;
import jmaster.io.thesisservice.service.ThesisService;

@RestController
@RequestMapping("/api")
public class ThesisAPIController {
    @Autowired
    private ThesisService thesisService;

    @PostMapping("/thesis/")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<ThesisDTO> create(@RequestBody @Valid ThesisDTO thesisDTO) throws IOException {
        thesisService.create(thesisDTO);
        return ResponseDTO.<ThesisDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(thesisDTO).build();
    }

    @PutMapping("/thesis/update")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<Void> update(@RequestBody @Valid ThesisDTO thesisDTO) throws IOException {
        thesisService.update(thesisDTO);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/thesis/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<ThesisDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<ThesisDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(thesisService.get(id)).build();
    }

    @DeleteMapping("/thesis/delete/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        thesisService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/thesis/{ids}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        thesisService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/thesis/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<List<ThesisDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return thesisService.find(searchDTO);
  
    }
    
    @GetMapping("/thesis/statistic")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public  ResponseDTO<Long> countThesis() {
        return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
        		.data(thesisService.countThesis()).build();
    }

    //Thống kê đồ án theo trạng thái:
    @GetMapping("/thesis/statistic/{status}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<Long> countThesisByStatus(
            @PathVariable("status") String status
    ) {
//        Long countThesis = thesisService.countThesisByStatus(status);
        return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
        		.data(thesisService.countThesisByStatus(status)).build();
    }

}
