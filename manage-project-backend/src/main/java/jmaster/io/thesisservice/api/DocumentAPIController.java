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
import jmaster.io.thesisservice.entity.Document;
import jmaster.io.thesisservice.entity.User;
import jmaster.io.thesisservice.repository.DocumentRepo;
import jmaster.io.thesisservice.service.DocumentService;
import jmaster.io.thesisservice.utils.FileStore;

import javax.persistence.NoResultException;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.io.File;
@RestController
@RequestMapping("/api")
public class DocumentAPIController {
    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentRepo documentRepo;
    
    @PostMapping("/document/")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<DocumentDTO> create(@ModelAttribute @Valid DocumentDTO documentDTO) throws IOException {
    	if(documentDTO.getFile() != null && !documentDTO.getFile().isEmpty()) {
			final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = documentDTO.getFile().getOriginalFilename();
//			String extension = filename.substring(filename.lastIndexOf("."));
//			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + filename);
			documentDTO.getFile().transferTo(newFile);
			documentDTO.setDocument(filename);
		}
        documentService.create(documentDTO);
        return ResponseDTO.<DocumentDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(documentDTO).build();
    }
    
    @GetMapping("document/download/{filename}")
	public void download(@PathVariable("filename") String filename, HttpServletResponse response) throws IOException {
		final String UPLOAD_FOLDER = "D:/file/user/";
		File file = new File(UPLOAD_FOLDER + filename);
		Files.copy(file.toPath(), response.getOutputStream());
	}
    
    @PutMapping("/document/update")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> update(@ModelAttribute @Valid DocumentDTO documentDTO) throws IOException {
        Document document = documentRepo.findById(documentDTO.getId()).orElseThrow(NoResultException::new);
        document.setTitle(documentDTO.getTitle());
    	if(documentDTO.getFile() != null && !documentDTO.getFile().isEmpty()) {
			final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = documentDTO.getFile().getOriginalFilename();
//			String extension = filename.substring(filename.lastIndexOf("."));
//			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + filename);
			documentDTO.getFile().transferTo(newFile);
			document.setDocument(filename);
		}
    	documentRepo.save(document);
        return ResponseEntity.ok("Document updated successfully!");
    }

    @GetMapping("/document/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public ResponseDTO<DocumentDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<DocumentDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(documentService.get(id)).build();
    }

    @DeleteMapping("/document/delete/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        documentService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/document/{ids}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        documentService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/document/search")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseDTO<List<DocumentDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    	System.out.println("1");
        return documentService.find(searchDTO);
    }

    @GetMapping("/document/count")
    public ResponseEntity<Page<Long>> countDocuments(Pageable pageable){
        Page<Long> countPage = documentService.countDocuments(pageable);
        return ResponseEntity.ok(countPage);
    }

    // Thống kê tài liệu theo id người dùng
    @GetMapping("/document/count/{userID}")
    public ResponseDTO<Page<Long>> countDocumentsByUserID(
            @PathVariable int userID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Long> documentsPage = documentService.countDocumentsByUserID(userID, pageable);
        return ResponseDTO.<Page<Long>>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .data(documentsPage)
                .totalElements(documentsPage.getTotalElements())
                .numberOfElements((long) documentsPage.getNumberOfElements())
                .totalPages((long) documentsPage.getTotalPages())
                .build();
    }

    //Lấy danh sách tài liệu theo studentCode
    @GetMapping("/document/statistic/{studentCode}")
    public ResponseDTO<Page<Document>> getDocumentsByStudentCode(
            @PathVariable("studentCode") String studentCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Document> documents = documentService.getDocumentsByStudentCode(studentCode, pageable);
        return ResponseDTO.<Page<Document>>builder()
                .code(String.valueOf(HttpStatus.OK.value()))
                .data(documents)
                .totalElements(documents.getTotalElements())
                .numberOfElements((long) documents.getNumberOfElements())
                .totalPages((long) documents.getTotalPages())
                .build();
    }

    //Lấy danh sách tài liệu theo người dùng
//    @GetMapping("/document/statistic/{username}")
//    public ResponseDTO<Page<Document>> getDocumentsByUser(
//            @PathVariable("username") String username,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        Pageable pageable = PageRequest.of(page, size);
//        Page<Document> documents = documentService.getDocumentsByUser(username, pageable);
//        return ResponseDTO.<Page<Document>>builder()
//                .code(String.valueOf(HttpStatus.OK.value()))
//                .data(documents)
//                .totalElements(documents.getTotalElements())
//                .numberOfElements((long) documents.getNumberOfElements())
//                .totalPages((long) documents.getTotalPages())
//                .build();
//    }

}
