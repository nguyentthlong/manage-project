//package jmaster.io.thesisservice.aop;
//
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.CacheManager;
//import org.springframework.stereotype.Component;
//
//import jmaster.io.thesisservice.dto.FacultyDTO;
//import jmaster.io.thesisservice.entity.Faculty;
//import jmaster.io.thesisservice.repository.FacultyRepo;
//import jmaster.io.thesisservice.utils.CacheNames;
//
//import javax.persistence.NoResultException;
//import java.util.List;
//
//@Aspect
//@Component
//public class FacultyServiceAspect {
//    @Autowired
//    CacheManager cacheManager;
//
//    @Autowired
//    FacultyRepo facultyRepo;
//
//    @Before("execution(* jmaster.io.thesisservice.service.FacultyService.create(*))")
//    public void create(JoinPoint joinPoint) {
//        cacheManager.getCache(CacheNames.CACHE_FACULTY_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_FACULTY).clear();
//    }
//
////    @Before("execution(* jmaster.io.tutorservice.service.CategoryService.update(*))")
////    public void update(JoinPoint joinPoint) {
////        CategoryDTO categoryDTO = (CategoryDTO) joinPoint.getArgs()[0];
////        Category currentUser = categoryRepo.findById(categoryDTO.getId()).orElseThrow(NoResultException::new);
////
////        cacheManager.getCache(CacheNames.CACHE_CATEGORY_FIND).clear();
////        cacheManager.getCache(CacheNames.CACHE_CATEGORY).evict(currentUser.getId());
////    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.ThesisService.delete(*))")
//    public void delete(JoinPoint joinPoint) {
//        int id = (Integer) joinPoint.getArgs()[0];
//        Faculty currentUser = facultyRepo.findById(id).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_FACULTY_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_FACULTY).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.ThesisService.deleteAll(*))")
//    public void deleteAll(JoinPoint joinPoint) {
//        @SuppressWarnings("unchecked")
//        List<Integer> ids = (List<Integer>) joinPoint.getArgs()[0];
//
//        List<Faculty> faculties = facultyRepo.findAllById(ids);
//
//        // clear cache
//        faculties.forEach(category -> {
//            cacheManager.getCache(CacheNames.CACHE_FACULTY).evict(category.getId());
//        });
//        cacheManager.getCache(CacheNames.CACHE_FACULTY_FIND).clear();
//    }
//}
