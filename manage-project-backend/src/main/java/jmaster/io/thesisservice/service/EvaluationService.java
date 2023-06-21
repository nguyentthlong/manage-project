package jmaster.io.thesisservice.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.NoResultException;

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

import jmaster.io.thesisservice.dto.EvaluationDTO;
import jmaster.io.thesisservice.dto.FacultyDTO;
import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.entity.Evaluation;
import jmaster.io.thesisservice.entity.Faculty;
import jmaster.io.thesisservice.repository.EvaluationRepo;
import jmaster.io.thesisservice.repository.StudentRepo;
import jmaster.io.thesisservice.repository.TeacherRepo;
import jmaster.io.thesisservice.repository.ThesisRepo;
import jmaster.io.thesisservice.utils.CacheNames;

public interface EvaluationService {
    void create(EvaluationDTO evaluationDTO);

    Long countEvaluation();

	void update(EvaluationDTO evaluationDTO);

    void delete(Integer id);

    void deleteAll(List<Integer> ids);

    EvaluationDTO get(Integer id);

    ResponseDTO<List<EvaluationDTO>> find(SearchDTO searchDTO);


@Service
class EvaluationServiceImpl implements  EvaluationService{

    @Autowired
    EvaluationRepo evaluationRepo;

    @Autowired
    TeacherRepo teacherRepo;
    
    @Autowired
    StudentRepo studentRepo;
    
    @Autowired
    ThesisRepo thesisRepo;
    
    
    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_EVALUATION_FIND,allEntries = true)
    public void create(EvaluationDTO evaluationDTO) {
        ModelMapper mapper = new ModelMapper();
        Evaluation evaluation = mapper.map(evaluationDTO, Evaluation.class);
        evaluationRepo.save(evaluation);
        evaluationDTO.setId(evaluation.getId());
    }

    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_EVALUATION_FIND,allEntries = true)
    public void update(EvaluationDTO evaluationDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.createTypeMap(EvaluationDTO.class, Evaluation.class)
                .setProvider(p -> evaluationRepo.findById(evaluationDTO.getId()).orElseThrow(NoResultException::new));

        Evaluation evaluation = mapper.map(evaluationDTO, Evaluation.class);
        evaluationRepo.save(evaluation);
    }

    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_EVALUATION_FIND,allEntries = true)
    public void delete(Integer id) {
        Evaluation evaluation = evaluationRepo.findById(id).orElseThrow(NoResultException::new);
        if(evaluation!= null){
        	evaluationRepo.deleteById(id);
        }
    }

    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_EVALUATION_FIND,allEntries = true)
    public void deleteAll(List<Integer> ids) {
    	evaluationRepo.deleteAllByIdInBatch(ids);
    }

    @Cacheable(CacheNames.CACHE_FACULTY)
    @Override
    public EvaluationDTO get(Integer id) {
        return evaluationRepo.findById(id).map(evaluation -> convert(evaluation)).orElseThrow(NoResultException::new);
    }

    @Cacheable(cacheNames = CacheNames.CACHE_EVALUATION_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
    @Override
    public ResponseDTO<List<EvaluationDTO>> find(SearchDTO searchDTO) {
        List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
                .map(order -> {
                    if (order.getOrder().equals(SearchDTO.ASC))
                        return Sort.Order.asc(order.getProperty());

                    return Sort.Order.desc(order.getProperty());
                }).collect(Collectors.toList());

        Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

        Page<Evaluation> page = evaluationRepo.searchByDescription(searchDTO.getValue(), pageable);

        ResponseDTO<List<EvaluationDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
        responseDTO.setData(page.get().map(evaluation -> convert(evaluation)).collect(Collectors.toList()));
        return responseDTO;
    }

    @Override
	public Long countEvaluation() {
		return evaluationRepo.count();
	}
    
    private EvaluationDTO convert(Evaluation evaluation) {
        return new ModelMapper().map(evaluation, EvaluationDTO.class);
    }
}
}
