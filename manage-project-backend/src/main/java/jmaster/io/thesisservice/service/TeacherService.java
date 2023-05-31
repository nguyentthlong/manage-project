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

import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.dto.StudentDTO;
import jmaster.io.thesisservice.dto.TeacherDTO;
import jmaster.io.thesisservice.entity.Faculty;
import jmaster.io.thesisservice.entity.Major;
import jmaster.io.thesisservice.entity.Student;
import jmaster.io.thesisservice.entity.Teacher;
import jmaster.io.thesisservice.entity.User;
import jmaster.io.thesisservice.repository.*;
import jmaster.io.thesisservice.utils.CacheNames;

import javax.persistence.NoResultException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface TeacherService {
    void create(TeacherDTO teacherDTO);
    void update(TeacherDTO teacherDTO);
    void delete(Integer id);
    void deleteAll(List<Integer> ids);
    TeacherDTO get(Integer id);
    ResponseDTO<List<TeacherDTO>> searchByTitle(SearchDTO searchDTO);

    Page<Long> countTeachers(Pageable pageable);

    Page<Long> countTeachersByFaculty(int facultyID, Pageable pageable);

    Page<Teacher> getTeachersByFaculty(int facultyID, Pageable pageable);
}

@Service
class TutorServiceImpl implements TeacherService {

    @Autowired
    TeacherRepo teacherRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    FacultyRepo facultyRepo;
    
    @Override
    @Transactional
    @CacheEvict(value = CacheNames.CACHE_TEACHER_FIND, allEntries = true)
    public void create(TeacherDTO teacherDTO) {
    	ModelMapper mapper = new ModelMapper();
        User user = userRepo.findById(teacherDTO.getUser().getId()).orElseThrow(NoResultException::new);
        Faculty faculty = facultyRepo.findById(teacherDTO.getFaculty().getId()).orElseThrow(NoResultException::new);
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setFaculty(faculty);
        teacher.setTeacherCode(teacherDTO.getTeacherCode());
        teacherDTO.setId(teacher.getId());
        teacherRepo.save(teacher);
    }

    @Override
    @Transactional
    @CacheEvict(value = CacheNames.CACHE_TEACHER_FIND, allEntries = true)
    public void update(TeacherDTO teacherDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.createTypeMap(TeacherDTO.class, Teacher.class)
                .setProvider(p -> teacherRepo.findById(teacherDTO.getId()).orElseThrow(NoResultException::new));

        Teacher teacher = mapper.map(teacherDTO, Teacher.class);
        teacherRepo.save(teacher);
    }

    @Override
    @Transactional
    @CacheEvict(value = CacheNames.CACHE_TEACHER_FIND, allEntries = true)
    public void delete(Integer id) {
        teacherRepo.deleteById(id);
    }

    @Override
    @Transactional
    @CacheEvict(value = CacheNames.CACHE_TEACHER_FIND, allEntries = true)
    public void deleteAll(List<Integer> ids) {
        teacherRepo.deleteAllById(ids);
    }

    @Cacheable(CacheNames.CACHE_TEACHER)
    @Override
    public TeacherDTO get(Integer id) {
        TeacherDTO teacherDTO = teacherRepo.findById(id).map(tutor -> convert(tutor)).orElseThrow(NoResultException::new);
        return teacherDTO;
    }

    @Cacheable(cacheNames = CacheNames.CACHE_TEACHER_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
    @Override
    public ResponseDTO<List<TeacherDTO>> searchByTitle(SearchDTO searchDTO) {
        List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
                .map(order -> {
                    if (order.getOrder().equals(SearchDTO.ASC))
                        return Sort.Order.asc(order.getProperty());

                    return Sort.Order.desc(order.getProperty());
                }).collect(Collectors.toList());

        Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

        Page<Teacher> page = teacherRepo.searchByName(searchDTO.getValue(), pageable);

        ResponseDTO<List<TeacherDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
        responseDTO.setData(page.get().map(tutor -> convert(tutor)).collect(Collectors.toList()));
        return responseDTO;
    }

    //Tổng số giáo viên
    @Override
    public Page<Long> countTeachers(Pageable pageable) {
        return teacherRepo.countTeachers(pageable);
    }

    @Override
    public Page<Long> countTeachersByFaculty(int facultyID, Pageable pageable) {
        return teacherRepo.countTeachersByFaculty(facultyID, pageable);
    }

    //get gv theo khoa
    @Override
    public Page<Teacher> getTeachersByFaculty(int facultyID, Pageable pageable) {
        return teacherRepo.getTeachersByFaculty(facultyID, pageable);
    }

    private TeacherDTO convert(Teacher teacher) {
        return new ModelMapper().map(teacher, TeacherDTO.class);
    }
 }
