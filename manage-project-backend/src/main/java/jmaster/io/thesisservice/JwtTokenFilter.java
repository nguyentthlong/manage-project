package jmaster.io.thesisservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import jmaster.io.thesisservice.service.JwtTokenService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//class dung de kiem tra token gui len
// chay truoc filter cua spring security
@Service
public class JwtTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenFilter.class);
    @Autowired
    private JwtTokenService jwtTokenProvider;

    //chi nen check cac path can security (can login)
    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                    FilterChain filterChain) throws ServletException, IOException {
        // doc token tu header
        String token = resolveToken(httpServletRequest);

        try {
            //verify token
            //if (token != null && jwtTokenProvider.validateToken(token)) {
            if(token!=null){
                //co token roi thi lay username, gọi db len user
                String username = jwtTokenProvider.getUsername(token);
                if(username!=null) {
                    Authentication auth = jwtTokenProvider.getAuthentication(username);
                    // set vao context de co dang nhap roi
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }else {
                    // this is very important, since it guarantees the user is not authenticated at
                    // all
                    SecurityContextHolder.clearContext();
                    httpServletResponse.sendError(401, "No Auth");
                    return;
                }
            }
        } catch (Exception ex) {
            /*// this is very important, since it guarantees the user is not authenticated at
            // all
            SecurityContextHolder.clearContext();
            httpServletResponse.sendError(401, ex.getMessage());
            return;*/
            logger.error("Cannot set user authentication: {}", ex);
        }

        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
    
    //lay token tu request gui len
    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        System.out.println("bearer Token: "+bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
