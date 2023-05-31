//package jmaster.io.thesisservice.aop;
//
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.CacheManager;
//import org.springframework.stereotype.Component;
//
//import jmaster.io.thesisservice.dto.TeacherDTO;
//import jmaster.io.thesisservice.entity.Teacher;
//import jmaster.io.thesisservice.repository.TeacherRepo;
//import jmaster.io.thesisservice.utils.CacheNames;
//
//import javax.persistence.NoResultException;
//import java.util.List;
//
//@Aspect
//@Component
//public class TeacherServiceAspect {
//    @Autowired
//    CacheManager cacheManager;
//
//    @Autowired
//    TeacherRepo teacherRepo;
//
//    @Before("execution(* jmaster.io.teacherservice.service.TeacherService.create(*))")
//    public void create(JoinPoint joinPoint) {
//        cacheManager.getCache(CacheNames.CACHE_TEACHER_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_TEACHER).clear();
//    }
//
//    @Before("execution(* jmaster.io.teacherservice.service.TeacherService.update(*))")
//    public void update(JoinPoint joinPoint) {
//        TeacherDTO teacherDTO = (TeacherDTO) joinPoint.getArgs()[0];
//        Teacher currentUser = teacherRepo.findById(teacherDTO.getId()).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_TEACHER_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_TEACHER).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.teacherservice.service.TeacherService.delete(*))")
//    public void delete(JoinPoint joinPoint) {
//        int id = (Integer) joinPoint.getArgs()[0];
//        Teacher currentUser = teacherRepo.findById(id).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_TEACHER_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_TEACHER).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.teacherservice.service.TeacherService.deleteAll(*))")
//    public void deleteAll(JoinPoint joinPoint) {
//        @SuppressWarnings("unchecked")
//        List<Integer> ids = (List<Integer>) joinPoint.getArgs()[0];
//
//        List<Teacher> teachers = teacherRepo.findAllById(ids);
//
//        // clear cache
//        teachers.forEach(post -> {
//            cacheManager.getCache(CacheNames.CACHE_TEACHER).evict(post.getId());
//        });
//        cacheManager.getCache(CacheNames.CACHE_TEACHER_FIND).clear();
//    }
//}
