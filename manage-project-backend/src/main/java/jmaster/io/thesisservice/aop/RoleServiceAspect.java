package jmaster.io.thesisservice.aop;
//package jmaster.io.blogservice.aop;
//
//import jmaster.io.blogservice.dto.RoleDTO;
//import jmaster.io.blogservice.entity.Role;
//import jmaster.io.blogservice.repository.RoleRepository;
//import jmaster.io.blogservice.utils.CacheNames;
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.CacheManager;
//import org.springframework.stereotype.Component;
//
//import javax.persistence.NoResultException;
//import java.util.List;
//
//@Aspect
//@Component
//public class RoleServiceAspect {
//    @Autowired
//    CacheManager cacheManager;
//    @Autowired
//    RoleRepository roleRepository;
//
//    @Before("execution(* com.java.jmaster.io.springapi.service.UserRoleService.create(*))")
//    public void create(JoinPoint joinPoint) {
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE).clear();
//    }
//
//    @Before("execution(* com.java.jmaster.io.springapi.service.UserRoleService.update(*))")
//    public void update(JoinPoint joinPoint) {
//        RoleDTO userRoleDTO = (RoleDTO) joinPoint.getArgs()[0];
//        Role currentUser = roleRepository.findById(userRoleDTO.getId()).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.blogservice.service.UserRoleService.delete(*))")
//    public void delete(JoinPoint joinPoint) {
//        int id = (Integer) joinPoint.getArgs()[0];
//        Role currentUser = roleRepository.findById(id).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.blogservice.service.UserRoleService.deleteByUserId(*))")
//    public void deleteByUserId(JoinPoint joinPoint) {
//        Integer id = (Integer) joinPoint.getArgs()[0];
//        Role currentUser = roleRepository.findById(id).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE).evict(currentUser.getId());
//    }
//
//    @Before("execution(* jmaster.io.blogservice.service.UserRoleService.deleteAll(*))")
//    public void deleteAll(JoinPoint joinPoint) {
//        @SuppressWarnings("unchecked")
//        List<Integer> ids = (List<Integer>) joinPoint.getArgs()[0];
//
//        List<Role> userRoles = roleRepository.findAllById(ids);
//
//        // clear cache
//        userRoles.forEach(userRole -> {
//            cacheManager.getCache(CacheNames.CACHE_USER_ROLE).evict(userRole.getId());
//        });
//        cacheManager.getCache(CacheNames.CACHE_USER_ROLE_FIND).clear();
//    }
//}
