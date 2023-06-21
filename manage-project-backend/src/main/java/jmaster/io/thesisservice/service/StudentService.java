
package jmaster.io.thesisservice.service;

import jmaster.io.thesisservice.entity.Classes;
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
import jmaster.io.thesisservice.dto.StudentDTO;
import jmaster.io.thesisservice.entity.Major;
import jmaster.io.thesisservice.entity.Student;
import jmaster.io.thesisservice.entity.User;
import jmaster.io.thesisservice.repository.*;
import jmaster.io.thesisservice.utils.CacheNames;

import javax.persistence.NoResultException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface StudentService {
void create(StudentDTO studentDTO);
Long countStudent();
void update(StudentDTO studentDTO);
void delete(Integer id);
void deleteAll(List<Integer> ids);
StudentDTO get(Integer id);
ResponseDTO<List<StudentDTO>> searchByTitle(SearchDTO searchDTO);
}

@Service
class StudentServiceImpl implements StudentService{
@Autowired
StudentRepo studentRepo;

@Autowired
UserRepo userRepo;

@Autowired
MajorRepo majorRepo;

@Autowired
ClassesRepo classesRepo;

@Override
@Transactional
@CacheEvict(value = CacheNames.CACHE_STUDENT_FIND,allEntries = true)
public void create(StudentDTO studentDTO) {
    ModelMapper mapper = new ModelMapper();
    User user = userRepo.findById(studentDTO.getUser().getId()).orElseThrow(NoResultException::new);
    Major major = majorRepo.findById(studentDTO.getMajor().getId()).orElseThrow(NoResultException::new);
    Classes classes = classesRepo.findById(studentDTO.getStudentClass().getId()).orElseThrow(NoResultException::new);
    Student student = new Student();
    student.setUser(user);
    student.setMajor(major);
    student.setStudentClass(classes);
	student.setStudentCode(studentDTO.getStudentCode());
    studentDTO.setId(student.getId());
	studentRepo.save(student);
}

@Override
@Transactional
@CacheEvict(value = CacheNames.CACHE_STUDENT_FIND,allEntries = true)
public void update(StudentDTO studentDTO) {
    ModelMapper mapper = new ModelMapper();
    mapper.createTypeMap(StudentDTO.class, Student.class)
            .setProvider(p -> studentRepo.findById(studentDTO.getId()).orElseThrow(NoResultException::new));

    Student student = mapper.map(studentDTO, Student.class);
    studentRepo.save(student);
}

@Override
@Transactional
@CacheEvict(value = CacheNames.CACHE_STUDENT_FIND,allEntries = true)
public void delete(Integer id) {
    studentRepo.deleteById(id);
}

@Override
@Transactional
@CacheEvict(value = CacheNames.CACHE_STUDENT_FIND,allEntries = true)
public void deleteAll(List<Integer> ids) {
    studentRepo.deleteAllById(ids);
}

@Cacheable(CacheNames.CACHE_STUDENT)
@Override
public StudentDTO get(Integer id) {
    StudentDTO studentDTO = studentRepo.findById(id).map(student -> convert(student)).orElseThrow(NoResultException::new);
        return studentDTO;
}

@Cacheable(cacheNames = CacheNames.CACHE_STUDENT_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
@Override
public ResponseDTO<List<StudentDTO>> searchByTitle(SearchDTO searchDTO) {
    List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
            .map(order -> {// Tạo 1 cái searchDTO dùng chung cho tất ca
                if (order.getOrder().equals(SearchDTO.ASC))
                    return Sort.Order.asc(order.getProperty());

                return Sort.Order.desc(order.getProperty());
            }).collect(Collectors.toList());

    Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

    Page<Student> page = studentRepo.searchByName(searchDTO.getValue(), pageable);

    ResponseDTO<List<StudentDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
    responseDTO.setData(page.get().map(post -> convert(post)).collect(Collectors.toList()));
    return responseDTO;
}

@Override
public Long countStudent() {
	return studentRepo.count();
}

private StudentDTO convert(Student student) {
    return new ModelMapper().map(student, StudentDTO.class);
}
}
