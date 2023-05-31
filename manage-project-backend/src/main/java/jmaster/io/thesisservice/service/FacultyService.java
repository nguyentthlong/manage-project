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

import jmaster.io.thesisservice.dto.FacultyDTO;
import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.entity.Faculty;
import jmaster.io.thesisservice.repository.FacultyRepo;
import jmaster.io.thesisservice.repository.MajorRepo;
import jmaster.io.thesisservice.utils.CacheNames;

import javax.persistence.NoResultException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface FacultyService {
    void create(FacultyDTO facultyDTO);

    void update(FacultyDTO facultyDTO);

    void delete(Integer id);

    void deleteAll(List<Integer> ids);

    FacultyDTO get(Integer id);

    ResponseDTO<List<FacultyDTO>> find(SearchDTO searchDTO);
}

@Service
class facultyServiceImpl implements  FacultyService{

    @Autowired
    FacultyRepo facultyRepo;

    @Autowired
    MajorRepo majorRepo;

    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_FACULTY_FIND,allEntries = true)
    public void create(FacultyDTO facultyDTO) {
        ModelMapper mapper = new ModelMapper();
        Faculty faculty = mapper.map(facultyDTO, Faculty.class);
        facultyRepo.save(faculty);
        facultyDTO.setId(faculty.getId());
    }

    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_FACULTY_FIND,allEntries = true)
    public void update(FacultyDTO facultyDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.createTypeMap(FacultyDTO.class, Faculty.class)
                .setProvider(p -> facultyRepo.findById(facultyDTO.getId()).orElseThrow(NoResultException::new));

        Faculty faculty = mapper.map(facultyDTO, Faculty.class);
        facultyRepo.save(faculty);
    }

    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_FACULTY_FIND,allEntries = true)
    public void delete(Integer id) {
        Faculty faculty = facultyRepo.findById(id).orElseThrow(NoResultException::new);
        if(faculty!= null){
            facultyRepo.deleteById(id);
        }
    }

    @Transactional
    @Override
    @CacheEvict(value = CacheNames.CACHE_FACULTY_FIND,allEntries = true)
    public void deleteAll(List<Integer> ids) {
        facultyRepo.deleteAllByIdInBatch(ids);
    }

    @Cacheable(CacheNames.CACHE_FACULTY)
    @Override
    public FacultyDTO get(Integer id) {
        return facultyRepo.findById(id).map(faculty -> convert(faculty)).orElseThrow(NoResultException::new);
    }

    @Cacheable(cacheNames = CacheNames.CACHE_FACULTY_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
    @Override
    public ResponseDTO<List<FacultyDTO>> find(SearchDTO searchDTO) {
        List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
                .map(order -> {
                    if (order.getOrder().equals(SearchDTO.ASC))
                        return Sort.Order.asc(order.getProperty());

                    return Sort.Order.desc(order.getProperty());
                }).collect(Collectors.toList());

        Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

        Page<Faculty> page = facultyRepo.find(searchDTO.getValue(), pageable);

        ResponseDTO<List<FacultyDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
        responseDTO.setData(page.get().map(faculty -> convert(faculty)).collect(Collectors.toList()));
        return responseDTO;
    }

    private FacultyDTO convert(Faculty faculty) {
        return new ModelMapper().map(faculty, FacultyDTO.class);
    }
}
