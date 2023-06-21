//package jmaster.io.thesisservice.aop;
//import jmaster.io.thesisservice.dto.UserDTO;
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.CacheManager;
//import org.springframework.stereotype.Component;
//
//import jmaster.io.thesisservice.entity.User;
//import jmaster.io.thesisservice.repository.UserRepo;
//import jmaster.io.thesisservice.utils.CacheNames;
//
//import javax.persistence.NoResultException;
//import java.util.List;
//
//@Aspect
//@Component
//public class UserServiceAspect {
//    @Autowired
//    CacheManager cacheManager;
//
//    @Autowired
//    UserRepo userRepo;
//
//    @Before("execution(* jmaster.io.thesisservice.service.UserService.create(*))")
//    public void create(JoinPoint joinPoint) {
//        cacheManager.getCache(CacheNames.CACHE_USER_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_USER).clear();
//    }
//
////    @Before("execution(* jmaster.io.thesisservice.service.UserService.update(*))")
////    public void update(JoinPoint joinPoint) {
////        UserDTO userDTO = (UserDTO) joinPoint.getArgs()[0];
////        User currentUser = userRepo.findById(userDTO.getId()).orElseThrow(NoResultException::new);
////
////        cacheManager.getCache(CacheNames.CACHE_USER_FIND).clear();
////        cacheManager.getCache(CacheNames.CACHE_USER).evict(currentUser.getId());
////    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.UserService.delete(*))")
//    public void delete(JoinPoint joinPoint) {
//        int id = (Integer) joinPoint.getArgs()[0];
//        User currentUser = userRepo.findById(id).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_USER_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_USER).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.UserService.deleteAll(*))")
//    public void deleteAll(JoinPoint joinPoint) {
//        @SuppressWarnings("unchecked")
//        List<Integer> ids = (List<Integer>) joinPoint.getArgs()[0];
//
//        List<User> users = userRepo.findAllById(ids);
//
////         clear cache
//        users.forEach(user -> {
//            cacheManager.getCache(CacheNames.CACHE_USER).evict(user.getId());
//        });
//        cacheManager.getCache(CacheNames.CACHE_USER_FIND).clear();
//    }
//}
