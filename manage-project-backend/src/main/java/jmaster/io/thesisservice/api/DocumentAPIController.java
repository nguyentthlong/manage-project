package jmaster.io.thesisservice.api;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseDTO<DocumentDTO> create(@ModelAttribute @Valid DocumentDTO documentDTO) throws IOException {
    	if(documentDTO.getFile() != null && !documentDTO.getFile().isEmpty()) {
    		final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = documentDTO.getFile().getOriginalFilename();
			String extension = filename.substring(filename.lastIndexOf("."));
			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + newFilename);
			documentDTO.getFile().transferTo(newFile);
			documentDTO.setDocument(newFilename);
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
    
//    @GetMapping("download/file")
//    public ResponseEntity<byte[]> downloadFile(String fileName) {
//        String filePath = new StringBuilder("D:/file/user/").append(fileName).toString();
//    	
//    	try {
//            ClassPathResource resource = new ClassPathResource(filePath);
//            
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.setContentDispositionFormData("attachment", fileName);
//            
//            return ResponseEntity.ok()
//                    .headers(headers)
//                    .body(resource.getInputStream().readAllBytes());
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.notFound().build();
//        }
//    }
    
    @GetMapping("/document/statistic")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT','ROLE_TEACHER')")
    public  ResponseDTO<Long> countThesis() {
        return ResponseDTO.<Long>builder().code(String.valueOf(HttpStatus.OK.value()))
        		.data(documentService.countDocument()).build();
    }
    
    @PutMapping("/document/update")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseEntity<?> update(@ModelAttribute @Valid DocumentDTO documentDTO) throws IOException {
        Document document = documentRepo.findById(documentDTO.getId()).orElseThrow(NoResultException::new);
        document.setTitle(documentDTO.getTitle());
    	if(documentDTO.getFile() != null && !documentDTO.getFile().isEmpty()) {
    		final String UPLOAD_FOLDER = "D:/file/user/";
			String filename = documentDTO.getFile().getOriginalFilename();
			String extension = filename.substring(filename.lastIndexOf("."));
			String newFilename = UUID.randomUUID().toString() + extension;
			File newFile = new File(UPLOAD_FOLDER + newFilename);
			documentDTO.getFile().transferTo(newFile);
			documentDTO.setDocument(newFilename);
		}
    	documentService.update(documentDTO);
        return ResponseEntity.ok("Document updated successfully!");
    }

    @GetMapping("/document/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseDTO<DocumentDTO> get(@PathVariable(value = "id") int id) {
        return ResponseDTO.<DocumentDTO>builder().code(String.valueOf(HttpStatus.OK.value()))
                .data(documentService.get(id)).build();
    }

    @DeleteMapping("/document/delete/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseDTO<Void> delete(@PathVariable(value = "id") int id) {
        documentService.delete(id);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }

    @DeleteMapping("/document/{ids}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseDTO<Void> deleteAll(@PathVariable(value = "ids") List<Integer> ids) {
        documentService.deleteAll(ids);
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }


    @PostMapping("/document/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER')")
    public ResponseDTO<List<DocumentDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
    	System.out.println("1");
        return documentService.find(searchDTO);
  
    }
}
