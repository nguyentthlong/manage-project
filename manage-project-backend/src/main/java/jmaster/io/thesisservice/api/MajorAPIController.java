package jmaster.io.thesisservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jmaster.io.thesisservice.dto.*;
import jmaster.io.thesisservice.service.MajorService;
import jmaster.io.thesisservice.utils.FileStore;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MajorAPIController {
    @Autowired
    private MajorService majorService;

    @PostMapping("/major/")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<MajorDTO> create(@RequestBody @Valid MajorDTO majorDTO) throws IOException {
        majorService.create(majorDTO);
        return ResponseDTO.<MajorDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(majorDTO).build();
    }

    @PutMapping("/major/update")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> update(@RequestBody @Valid MajorDTO majorDTO) throws IOException {
        majorService.update(majorDTO);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/major/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public ResponseDTO<MajorDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<MajorDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(majorService.get(id)).build();
    }

    @DeleteMapping("/major/delete/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        majorService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/major/{ids}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        majorService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/major/search")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<List<MajorDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    	System.out.println("1");
        return majorService.searchByTitle(searchDTO);
  
    }
}
