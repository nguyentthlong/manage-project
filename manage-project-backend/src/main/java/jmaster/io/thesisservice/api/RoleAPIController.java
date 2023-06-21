package jmaster.io.thesisservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jmaster.io.thesisservice.dto.FacultyDTO;
import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.RoleDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.service.FacultyService;
import jmaster.io.thesisservice.service.RoleService;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class RoleAPIController {
    @Autowired
    private RoleService roleService;

    @PostMapping("/admin/role/")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<RoleDTO> create(@RequestBody @Valid RoleDTO roleDTO) throws IOException {
        // goi qua Service
    	roleService.create(roleDTO);
        return ResponseDTO.<RoleDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(roleDTO).build();
    }

    @PutMapping("/admin/role/update")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> update(@RequestBody @Valid RoleDTO roleDTO) throws IOException {
    	roleService.update(roleDTO);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @GetMapping("/admin/role/{id}")	
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<RoleDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<RoleDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(roleService.get(id)).build();
    }

    @DeleteMapping(value = "/admin/role/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
    	roleService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/admin/role/deleteAll/{ids}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
    	roleService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/admin/role/search")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<List<RoleDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return roleService.searchByTitle(searchDTO);
    }

}
