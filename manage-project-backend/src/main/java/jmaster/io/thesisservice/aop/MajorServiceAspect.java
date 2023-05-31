//package jmaster.io.thesisservice.aop;
//
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.CacheManager;
//import org.springframework.stereotype.Component;
//
//import jmaster.io.thesisservice.dto.MajorDTO;
//import jmaster.io.thesisservice.entity.Major;
//import jmaster.io.thesisservice.repository.MajorRepo;
//import jmaster.io.thesisservice.utils.CacheNames;
//
//import javax.persistence.NoResultException;
//import java.util.List;
//
//@Aspect
//@Component
//public class MajorServiceAspect {
//    @Autowired
//    CacheManager cacheManager;
//
//    @Autowired
//    MajorRepo majorRepo;
//
//    @Before("execution(* jmaster.io.thesisservice.service.MajorService.create(*))")
//    public void create(JoinPoint joinPoint) {
//        cacheManager.getCache(CacheNames.CACHE_MAJOR_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_MAJOR).clear();
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.MajorService.update(*))")
//    public void update(JoinPoint joinPoint) {
//        MajorDTO majorDTO = (MajorDTO) joinPoint.getArgs()[0];
//        Major currentUser = majorRepo.findById(majorDTO.getId()).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_MAJOR_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_MAJOR).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.MajorService.delete(*))")
//    public void delete(JoinPoint joinPoint) {
//        int id = (Integer) joinPoint.getArgs()[0];
//        Major currentUser = majorRepo.findById(id).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_MAJOR_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_MAJOR).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.MajorService.deleteAll(*))")
//    public void deleteAll(JoinPoint joinPoint) {
//        @SuppressWarnings("unchecked")
//        List<Integer> ids = (List<Integer>) joinPoint.getArgs()[0];
//
//        List<Major> majors = majorRepo.findAllById(ids);
//
//        // clear cache
//        majors.forEach(post -> {
//            cacheManager.getCache(CacheNames.CACHE_MAJOR).evict(post.getId());
//        });
//        cacheManager.getCache(CacheNames.CACHE_MAJOR_FIND).clear();
//    }
//}
