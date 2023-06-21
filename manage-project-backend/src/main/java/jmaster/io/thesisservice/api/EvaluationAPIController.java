package jmaster.io.thesisservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jmaster.io.thesisservice.dto.*;
import jmaster.io.thesisservice.service.EvaluationService;
import jmaster.io.thesisservice.utils.FileStore;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class EvaluationAPIController {
    @Autowired
    private EvaluationService evaluationService;

    @PostMapping("/evaluation/")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseDTO<EvaluationDTO> create(@RequestBody @Valid EvaluationDTO evaluationDTO) throws IOException {
        evaluationService.create(evaluationDTO);
        return ResponseDTO.<EvaluationDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(evaluationDTO).build();
    }

    @PutMapping("/evaluation/update")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseDTO<Void> update(@RequestBody @Valid EvaluationDTO evaluationDTO) throws IOException {
        evaluationService.update(evaluationDTO);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/evaluation/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<EvaluationDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<EvaluationDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(evaluationService.get(id)).build();
    }

    @DeleteMapping("/evaluation/delete/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        evaluationService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/evaluation/{ids}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        evaluationService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/evaluation/statistic")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public  ResponseDTO<Long> countThesis() {
        return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
        		.data(evaluationService.countEvaluation()).build();
    }
    
    @PostMapping("/evaluation/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public ResponseDTO<List<EvaluationDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    	System.out.println("1");
        return evaluationService.find(searchDTO);
  
    }
}
