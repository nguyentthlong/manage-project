//package jmaster.io.thesisservice.aop;
//import jmaster.io.thesisservice.dto.DocumentDTO;
//import jmaster.io.thesisservice.dto.UserDTO;
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.CacheManager;
//import org.springframework.stereotype.Component;
//
//import jmaster.io.thesisservice.entity.Document;
//import jmaster.io.thesisservice.entity.User;
//import jmaster.io.thesisservice.repository.DocumentRepo;
//import jmaster.io.thesisservice.repository.UserRepo;
//import jmaster.io.thesisservice.utils.CacheNames;
//
//import javax.persistence.NoResultException;
//import java.util.List;
//
//@Aspect
//@Component
//public class DocumentServiceAspect {
//    @Autowired
//    CacheManager cacheManager;
//
//    @Autowired
//    DocumentRepo documentRepo;
//
//    @Before("execution(* jmaster.io.thesisservice.service.DocumentService.create(*))")
//    public void create(JoinPoint joinPoint) {
//        cacheManager.getCache(CacheNames.CACHE_DOCUMENT_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_DOCUMENT).clear();
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.DocumentService.update(*))")
//    public void update(JoinPoint joinPoint) {
//        DocumentDTO documentDTO = (DocumentDTO) joinPoint.getArgs()[0];
//        Document currentDocument = documentRepo.findById(documentDTO.getId()).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_DOCUMENT_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_DOCUMENT).evict(currentDocument.getId());
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.DocumentService.delete(*))")
//    public void delete(JoinPoint joinPoint) {
//        int id = (Integer) joinPoint.getArgs()[0];
//        Document currentDocument = documentRepo.findById(id).orElseThrow(NoResultException::new);
//
//        cacheManager.getCache(CacheNames.CACHE_DOCUMENT_FIND).clear();
//        cacheManager.getCache(CacheNames.CACHE_DOCUMENT).evict(currentDocument.getId());
//    }
//
//    @Before("execution(* jmaster.io.thesisservice.service.DocumentService.deleteAll(*))")
//    public void deleteAll(JoinPoint joinPoint) {
//        @SuppressWarnings("unchecked")
//        List<Integer> ids = (List<Integer>) joinPoint.getArgs()[0];
//
//        List<Document> documents = documentRepo.findAllById(ids);
//
////         clear cache
//        documents.forEach(document -> {
//            cacheManager.getCache(CacheNames.CACHE_DOCUMENT).evict(document.getId());
//        });
//        cacheManager.getCache(CacheNames.CACHE_DOCUMENT_FIND).clear();
//    }
//}
