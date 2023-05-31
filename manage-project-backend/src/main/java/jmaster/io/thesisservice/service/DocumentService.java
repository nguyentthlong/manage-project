package jmaster.io.thesisservice.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jmaster.io.thesisservice.dto.DocumentDTO;
import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.entity.Document;
import jmaster.io.thesisservice.repository.DocumentRepo;
import jmaster.io.thesisservice.repository.MajorRepo;
import jmaster.io.thesisservice.utils.CacheNames;

import javax.persistence.NoResultException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface DocumentService {
void create(DocumentDTO documentDTO);
void update(DocumentDTO documentDTO);

void delete(Integer id);

void deleteAll(List<Integer> ids);

DocumentDTO get(Integer id);

ResponseDTO<List<DocumentDTO>> find(SearchDTO searchDTO);

	Page<Long> countDocuments(Pageable pageable);

	Page<Long> countDocumentsByUserID(int userID, Pageable pageable);

	Page<Document> getDocumentsByStudentCode(String studentCode, Pageable pageable);

	//Lấy danh sách tài liệu theo người dùng
//	Page<Document> getDocumentsByUser(String username, Pageable pageable);
}

@Service
class DocumentServiceImpl implements DocumentService{
	@Autowired
	DocumentRepo documentRepo;

	@Autowired
	MajorRepo majorRepo;

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_DOCUMENT_FIND,allEntries = true)
	public void create(DocumentDTO documentDTO) {
	    ModelMapper mapper = new ModelMapper();
	    Document document = mapper.map(documentDTO, Document.class);
	    documentRepo.save(document);
	    documentDTO.setId(document.getId());
	}

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_DOCUMENT_FIND,allEntries = true)
	public void update(DocumentDTO documentDTO) {
	    ModelMapper mapper = new ModelMapper();
	    mapper.createTypeMap(DocumentDTO.class, Document.class)
	            .setProvider(p -> documentRepo.findById(documentDTO.getId()).orElseThrow(NoResultException::new));

	    Document document = mapper.map(documentDTO, Document.class);
	    documentRepo.save(document);
	}

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_DOCUMENT_FIND,allEntries = true)
	public void delete(Integer id) {
	    Document document = documentRepo.findById(id).orElseThrow(NoResultException::new);
	    if(document!= null){
	        documentRepo.deleteById(id);
	    }
	}

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_DOCUMENT_FIND,allEntries = true)
	public void deleteAll(List<Integer> ids) {
	    documentRepo.deleteAllByIdInBatch(ids);
	}

	@Cacheable(CacheNames.CACHE_DOCUMENT)
	@Override
	public DocumentDTO get(Integer id) {
	    return documentRepo.findById(id).map(document -> convert(document)).orElseThrow(NoResultException::new);
	}

	@Cacheable(cacheNames = CacheNames.CACHE_DOCUMENT_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
	@Override
	public ResponseDTO<List<DocumentDTO>> find(SearchDTO searchDTO) {
	    List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
	            .map(order -> {
	                if (order.getOrder().equals(SearchDTO.ASC))
	                    return Sort.Order.asc(order.getProperty());

	                return Sort.Order.desc(order.getProperty());
	            }).collect(Collectors.toList());

	    Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

	    Page<Document> page = documentRepo.searchByTitle(searchDTO.getValue(), pageable);

	    ResponseDTO<List<DocumentDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
	    responseDTO.setData(page.get().map(document -> convert(document)).collect(Collectors.toList()));
	    return responseDTO;
	}

	@Override
	public Page<Long> countDocuments(Pageable pageable) {
		return documentRepo.countDocuments(pageable);
	}

	@Override
	public Page<Long> countDocumentsByUserID(int userID, Pageable pageable) {
		return documentRepo.countDocumentsByUserID(userID, pageable);
	}

	@Override
	public Page<Document> getDocumentsByStudentCode(String studentCode, Pageable pageable) {
		return documentRepo.getDocumentsByStudentCode(studentCode, pageable);
	}

//	@Override
//	public Page<Document> getDocumentsByUser(String username, Pageable pageable) {
//		return documentRepo.getDocumentsByUser(username, pageable);
//	}

	private DocumentDTO convert(Document document) {
	    return new ModelMapper().map(document, DocumentDTO.class);
	}
	
}