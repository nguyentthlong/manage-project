package jmaster.io.thesisservice.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jmaster.io.thesisservice.dto.ThesisDTO;
import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.entity.Thesis;
import jmaster.io.thesisservice.repository.ThesisRepo;
import jmaster.io.thesisservice.repository.MajorRepo;
import jmaster.io.thesisservice.utils.CacheNames;

import javax.persistence.NoResultException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface ThesisService {
void create(ThesisDTO thesisDTO);

Long countThesisByStatus(String status);

Long countThesis();

Page<Thesis> getThesisByStatus(String status, Pageable pageable);

void update(ThesisDTO thesisDTO);

void delete(Integer id);

void deleteAll(List<Integer> ids);

ThesisDTO get(Integer id);

ResponseDTO<List<ThesisDTO>> find(SearchDTO searchDTO);


}

@Service
class thesisServiceImpl implements ThesisService{
	@Autowired
	ThesisRepo thesisRepo;

	@Autowired
	MajorRepo majorRepo;

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_THESIS_FIND,allEntries = true)
	public void create(ThesisDTO thesisDTO) {
	    ModelMapper mapper = new ModelMapper();
	    Thesis thesis = mapper.map(thesisDTO, Thesis.class);
	    thesisRepo.save(thesis);
	    thesisDTO.setId(thesis.getId());
	}

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_THESIS_FIND,allEntries = true)
	public void update(ThesisDTO thesisDTO) {
	    ModelMapper mapper = new ModelMapper();
	    mapper.createTypeMap(ThesisDTO.class, Thesis.class)
	            .setProvider(p -> thesisRepo.findById(thesisDTO.getId()).orElseThrow(NoResultException::new));

	    Thesis thesis = mapper.map(thesisDTO, Thesis.class);
	    thesisRepo.save(thesis);
	}

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_THESIS_FIND,allEntries = true)
	public void delete(Integer id) {
	    Thesis thesis = thesisRepo.findById(id).orElseThrow(NoResultException::new);
	    if(thesis!= null){
	        thesisRepo.deleteById(id);
	    }
	}

	@Transactional
	@Override
	@CacheEvict(value = CacheNames.CACHE_THESIS_FIND,allEntries = true)
	public void deleteAll(List<Integer> ids) {
	    thesisRepo.deleteAllByIdInBatch(ids);
	}

	@Cacheable(CacheNames.CACHE_THESIS)
	@Override
	public ThesisDTO get(Integer id) {
	    return thesisRepo.findById(id).map(thesis -> convert(thesis)).orElseThrow(NoResultException::new);
	}

	@Cacheable(cacheNames = CacheNames.CACHE_THESIS_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
	@Override
	public ResponseDTO<List<ThesisDTO>> find(SearchDTO searchDTO) {
	    List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
	            .map(order -> {
	                if (order.getOrder().equals(SearchDTO.ASC))
	                    return Sort.Order.asc(order.getProperty());

	                return Sort.Order.desc(order.getProperty());
	            }).collect(Collectors.toList());
	    Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

	    Page<Thesis> page = thesisRepo.searchByTitle(searchDTO.getValue(), pageable);

	    ResponseDTO<List<ThesisDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
	    responseDTO.setData(page.get().map(thesis -> convert(thesis)).collect(Collectors.toList()));
	    return responseDTO;
	}

	@Override
	public Long countThesis() {
		return thesisRepo.count();
	}

	@Override
	public Long countThesisByStatus(String status ) {
		return thesisRepo.countThesisByStatus(status);
	}
	
	private ThesisDTO convert(Thesis thesis) {
	    return new ModelMapper().map(thesis, ThesisDTO.class);
	}
	
	@Override
	public Page<Thesis> getThesisByStatus(String status, Pageable pageable) {
		return thesisRepo.getThesisByStatus(status, pageable);
	}
}
	
	