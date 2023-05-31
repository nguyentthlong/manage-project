package jmaster.io.thesisservice.api;

import jmaster.io.thesisservice.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<EvaluationDTO> create(@RequestBody @Valid EvaluationDTO evaluationDTO) throws IOException {
        evaluationService.create(evaluationDTO);
        return ResponseDTO.<EvaluationDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(evaluationDTO).build();
    }

    @PutMapping("/evaluation/update")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> update(@RequestBody @Valid EvaluationDTO evaluationDTO) throws IOException {
        evaluationService.update(evaluationDTO);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/evaluation/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public ResponseDTO<EvaluationDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<EvaluationDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(evaluationService.get(id)).build();
    }

    @DeleteMapping("/evaluation/delete/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        evaluationService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/evaluation/{ids}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        evaluationService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/evaluation/search")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<List<EvaluationDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    	System.out.println("1");
        return evaluationService.find(searchDTO);
    }

    @GetMapping("/evaluation/count")
    public ResponseEntity<Page<Long>> countEvaluation(Pageable pageable){
        Page<Long> countPage = evaluationService.countEvaluations(pageable);
        return ResponseEntity.ok(countPage);
    }

    //Lấy điểm cao nhất trong tất cả các đánh giá và show thông tin teacher, student, thsis liên quan
    @GetMapping("/evaluation/mark")
    public ResponseDTO<Page<Object[]>> findHighestMark(Pageable pageable) {
        Page<Object[]> maxMark = evaluationService.findHighestMark(pageable);
        return ResponseDTO.<Page<Object[]>>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .data(maxMark)
                .totalElements(maxMark.getTotalElements())
                .numberOfElements((long) maxMark.getNumberOfElements())
                .totalPages((long) maxMark.getTotalPages())
                .build();
    }

}
