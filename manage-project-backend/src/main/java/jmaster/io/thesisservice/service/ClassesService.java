package jmaster.io.thesisservice.service;

import jmaster.io.thesisservice.dto.ClassesDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.entity.Classes;
import jmaster.io.thesisservice.repository.ClassesRepo;
import jmaster.io.thesisservice.repository.MajorRepo;
import jmaster.io.thesisservice.utils.CacheNames;

import javax.persistence.NoResultException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
public interface ClassesService {

	ClassesDTO get(Integer id);

	Long countClasses();

	ResponseDTO<List<ClassesDTO>> find(SearchDTO searchDTO);

	void deleteAll(List<Integer> ids);

	void delete(Integer id);

	void update(ClassesDTO classesDTO);

	void create(ClassesDTO classesDTO);
	
}

@Service
class ClassesServiceImpl implements ClassesService {
@Autowired
ClassesRepo classesRepo;

@Autowired
MajorRepo majorRepo;

@Transactional
@Override
@CacheEvict(value = CacheNames.CACHE_CLASSES_FIND, allEntries = true)
public void create(ClassesDTO classesDTO) {
    ModelMapper mapper = new ModelMapper();
    Classes classes = mapper.map(classesDTO, Classes.class);
    classesRepo.save(classes);
    classesDTO.setId(classes.getId());
}

@Transactional
@Override
@CacheEvict(value = CacheNames.CACHE_CLASSES_FIND, allEntries = true)
public void update(ClassesDTO classesDTO) {
    ModelMapper mapper = new ModelMapper();
    mapper.createTypeMap(ClassesDTO.class, Classes.class)
            .setProvider(p -> classesRepo.findById(classesDTO.getId()).orElseThrow(NoResultException::new));

    Classes classes = mapper.map(classesDTO, Classes.class);
    classesRepo.save(classes);
}

@Transactional
@Override
@CacheEvict(value = CacheNames.CACHE_CLASSES_FIND, allEntries = true)
public void delete(Integer id) {
    Classes classes = classesRepo.findById(id).orElseThrow(NoResultException::new);
    if (classes != null) {
        classesRepo.deleteById(id);
    }
}

@Transactional
@Override
@CacheEvict(value = CacheNames.CACHE_CLASSES_FIND, allEntries = true)
public void deleteAll(List<Integer> ids) {
    classesRepo.deleteAllByIdInBatch(ids);
}

@Cacheable(CacheNames.CACHE_CLASSES)
@Override
public ClassesDTO get(Integer id) {
    return classesRepo.findById(id).map(classes -> convert(classes)).orElseThrow(NoResultException::new);
}

// @Cacheable(cacheNames = CacheNames.CACHE_CLASSES_FIND, unless = "#result.totalElements == 0", key =
// "#searchDTO.toString()")
@Override
public ResponseDTO<List<ClassesDTO>> find(SearchDTO searchDTO) {
    List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
            .map(order -> {
                if (order.getOrder().equals(SearchDTO.ASC))
                    return Sort.Order.asc(order.getProperty());

                return Sort.Order.desc(order.getProperty());
            }).collect(Collectors.toList());

    Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    List<String> list = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
            .map(i -> i.getAuthority()).collect(Collectors.toList());
    Page<Classes> page = null;
    page = classesRepo.searchByTitle(searchDTO.getValue(), pageable);
    ResponseDTO<List<ClassesDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
    responseDTO.setData(page.get().map(classes -> convert(classes)).collect(Collectors.toList()));
    return responseDTO;
}

@Override
public Long countClasses() {
    return classesRepo.count();
}

private ClassesDTO convert(Classes classes) {
    return new ModelMapper().map(classes, ClassesDTO.class);
}
}
