package jmaster.io.thesisservice;


import jmaster.io.thesisservice.entity.User;
import jmaster.io.thesisservice.repository.UserRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JPAConfiguration {
    @Autowired
	UserRepo userRepository;

	@Bean
	AuditorAware<User> auditorProvider() {
		return new AuditorAware<User>() {
			@Override
			public Optional<User> getCurrentAuditor() {
				Authentication auth = SecurityContextHolder.getContext().getAuthentication();
				User user =null;
				if (auth != null && !(auth instanceof AnonymousAuthenticationToken))
					user = userRepository.findByUsername(auth.getName()).orElse(null);
				return Optional.ofNullable(user);

			}
		};
	}
}
