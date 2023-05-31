package jmaster.io.thesisservice.api;

import jmaster.io.thesisservice.entity.Thesis;
import org.apache.coyote.Response;
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
import jmaster.io.thesisservice.service.ThesisService;
import jmaster.io.thesisservice.utils.FileStore;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ThesisAPIController {
    @Autowired
    private ThesisService thesisService;

    @PostMapping("/thesis/")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<ThesisDTO> create(@RequestBody @Valid ThesisDTO thesisDTO) throws IOException {
        thesisService.create(thesisDTO);
        return ResponseDTO.<ThesisDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(thesisDTO).build();
    }

    @PutMapping("/thesis/update")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> update(@RequestBody @Valid ThesisDTO thesisDTO) throws IOException {
        thesisService.update(thesisDTO);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/thesis/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public ResponseDTO<ThesisDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<ThesisDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(thesisService.get(id)).build();
    }

    @DeleteMapping("/thesis/delete/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        thesisService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/thesis/{ids}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        thesisService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/thesis/search")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<List<ThesisDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    	System.out.println("1");
        return thesisService.find(searchDTO);
    }

    @GetMapping("/thesis/count")
    public ResponseEntity<Page<Long>> countThesis(Pageable pageable) {
        Page<Long> countPage = thesisService.countThesis(pageable);
        return ResponseEntity.ok(countPage);
    }

    //Thống kê đồ án theo trạng thái:
    @GetMapping("/thesis/count/{status}")
    public ResponseEntity<Page<Long>> countThesisByStatus(
            @PathVariable("status") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Long> thesisPage = thesisService.countThesisByStatus(status, pageable);
        return ResponseEntity.ok(thesisPage);
    }

    //Lấy danh sách đồ án theo trạng thái và phân trang
    @GetMapping("/thesis/statistic/{status}")
    public ResponseEntity<Page<Thesis>> getThesisByStatus(
            @PathVariable("status") String status, //enable - disable
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Thesis> thesisPage = thesisService.getThesisByStatus(status, pageable);
        return ResponseEntity.ok(thesisPage);
    }


}
