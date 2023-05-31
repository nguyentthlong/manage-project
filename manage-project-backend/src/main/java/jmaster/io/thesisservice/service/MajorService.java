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

import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.dto.MajorDTO;
import jmaster.io.thesisservice.entity.Faculty;
import jmaster.io.thesisservice.entity.Major;
import jmaster.io.thesisservice.repository.*;
import jmaster.io.thesisservice.utils.CacheNames;

import javax.persistence.NoResultException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface MajorService {
  void create(MajorDTO majorDTO);
  void update(MajorDTO majorDTO);
  void delete(Integer id);
  void deleteAll(List < Integer > ids);
  MajorDTO get(Integer id);
  ResponseDTO < List < MajorDTO >> searchByTitle(SearchDTO searchDTO);
}

@Service
class MajorServiceImpl implements MajorService {
  @Autowired
  MajorRepo majorRepo;

  @Autowired
  FacultyRepo facultyRepo;

  @Override
  @Transactional
  @CacheEvict(value = CacheNames.CACHE_MAJOR_FIND, allEntries = true)
  public void create(MajorDTO majorDTO) {
    ModelMapper mapper = new ModelMapper();
    Major major = mapper.map(majorDTO, Major.class);
    Faculty faculty = facultyRepo.findById(majorDTO.getFaculty().getId()).orElseThrow(NoResultException::new);
    major.setFaculty(faculty);
    majorRepo.save(major);
    majorDTO.setId(major.getId());
  }

  @Override
  @Transactional
  @CacheEvict(value = CacheNames.CACHE_MAJOR_FIND, allEntries = true)
  public void update(MajorDTO majorDTO) {
    ModelMapper mapper = new ModelMapper();
    mapper.createTypeMap(MajorDTO.class, Major.class)
      .setProvider(p -> majorRepo.findById(majorDTO.getId()).orElseThrow(NoResultException::new));

    Major major = mapper.map(majorDTO, Major.class);
    majorRepo.save(major);
  }

  @Override
  @Transactional
  @CacheEvict(value = CacheNames.CACHE_MAJOR_FIND, allEntries = true)
  public void delete(Integer id) {
    majorRepo.deleteById(id);
  }

  @Override
  @Transactional
  @CacheEvict(value = CacheNames.CACHE_MAJOR_FIND, allEntries = true)
  public void deleteAll(List < Integer > ids) {
    majorRepo.deleteAllById(ids);
  }

  @Cacheable(CacheNames.CACHE_MAJOR)
  @Override
  public MajorDTO get(Integer id) {
    MajorDTO majorDTO = majorRepo.findById(id).map(major -> convert(major)).orElseThrow(NoResultException::new);
    return majorDTO;
  }

  @Cacheable(cacheNames = CacheNames.CACHE_MAJOR_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
  @Override
  public ResponseDTO < List < MajorDTO >> searchByTitle(SearchDTO searchDTO) {
	    System.out.println("1");
    List < Sort.Order > orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
      .map(order -> { // Tạo 1 cái searchDTO dùng chung cho tất ca
        if (order.getOrder().equals(SearchDTO.ASC))
          return Sort.Order.asc(order.getProperty());

        return Sort.Order.desc(order.getProperty());
      }).collect(Collectors.toList());

    Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

    Page < Major > page = majorRepo.searchByTitle(searchDTO.getValue(), pageable);
    ResponseDTO < List < MajorDTO >> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
    responseDTO.setData(page.get().map(major -> convert(major)).collect(Collectors.toList()));
    return responseDTO;
  }
  private MajorDTO convert(Major major) {
    return new ModelMapper().map(major, MajorDTO.class);
  }

}