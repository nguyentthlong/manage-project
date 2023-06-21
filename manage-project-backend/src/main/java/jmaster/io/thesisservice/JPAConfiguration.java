package jmaster.io.thesisservice;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jmaster.io.thesisservice.dto.LoginUser;
import jmaster.io.thesisservice.entity.User;

@Configuration
@EnableJpaAuditing
public class JPAConfiguration {
	@Bean
	AuditorAware<User> auditorProvider() {
		return new AuditorAware<User>() {
			@Override
			public Optional<User> getCurrentAuditor() {
				Authentication auth = SecurityContextHolder.getContext().getAuthentication();
				User user = null;
				if (auth != null && !(auth instanceof AnonymousAuthenticationToken)) {
					LoginUser currentUser = (LoginUser) auth.getPrincipal();
					user = new User();
					user.setId(currentUser.getId());
				}
				return Optional.ofNullable(user);

			}
		};
	}
}
