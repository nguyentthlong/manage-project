package jmaster.io.thesisservice.service;

import io.jsonwebtoken.*;
import jmaster.io.thesisservice.dto.JwtResponse;
import jmaster.io.thesisservice.entity.RefreshToken;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtTokenService {
    @Value("${jwt.secret:123456")
    private String secretKey;

    private long validityInMilliseconds = 3600000; // 1h

    @Autowired
    UserDetailsService userDetailsService;


    public String createToken(String username, Collection<? extends GrantedAuthority> authorities) {
		Claims claims = Jwts.claims().setSubject(username);
        Date now = new Date();
        Date expiredTime = new Date(now.getTime() + validityInMilliseconds);
        String accessToken = Jwts.builder()
                .claim("role",authorities)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiredTime)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
        return accessToken;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public String getUsername(String token) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                    .getBody().getSubject();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public Authentication getAuthentication(String username) {
        UserDetails userDetails = userDetailsService.
                loadUserByUsername((username));
        return new UsernamePasswordAuthenticationToken(userDetails, "",
                userDetails.getAuthorities());
    }
}
