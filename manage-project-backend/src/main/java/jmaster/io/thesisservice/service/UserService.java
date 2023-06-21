package jmaster.io.thesisservice.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.NoResultException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jmaster.io.thesisservice.dto.ResponseDTO;
import jmaster.io.thesisservice.dto.SearchDTO;
import jmaster.io.thesisservice.dto.UserDTO;
import jmaster.io.thesisservice.entity.User;
import jmaster.io.thesisservice.repository.RoleRepo;
import jmaster.io.thesisservice.repository.UserRepo;
import jmaster.io.thesisservice.utils.CacheNames;
import jmaster.io.thesisservice.entity.Role;

public interface UserService {
	void create(UserDTO userDTO);

	void signup(UserDTO userDTO);

	Long countUser();

	void update(UserDTO userDTO);

	void delete(Integer id);

	void deleteAll(List<Integer> ids);

	UserDTO get(Integer id);

	ResponseDTO<List<UserDTO>> searchByTitle(SearchDTO searchDTO);
	UserDTO getUserByUsername(String username);
}

@Service
class UserServiceImpl implements UserService {
	@Autowired
	UserRepo userRepo;

	@Autowired
	RoleRepo roleRepo;
	
	@Override
	@Transactional
	@CacheEvict(value = CacheNames.CACHE_USER_FIND, allEntries = true)
	public void create(UserDTO userDTO) {
		ModelMapper mapper = new ModelMapper();
		User user = mapper.map(userDTO, User.class);
		user.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));
		userRepo.save(user);
		userDTO.setId(user.getId());
	}
	
	 @Override
	  @Transactional
	  @CacheEvict(value = CacheNames.CACHE_USER_FIND, allEntries = true)
	  public void signup(UserDTO userDTO) {
	    ModelMapper mapper = new ModelMapper();
	    User user = mapper.map(userDTO, User.class);
		user.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));
	    List<Role> strRoles = new ArrayList<>();
	    strRoles.add(roleRepo.findById(2).orElseThrow(null));
	    user.setRoles(strRoles);
	    userRepo.save(user);
	    userDTO.setId(user.getId());
	  }

	@Override
	@Transactional
	public void update(UserDTO userDTO) {
		ModelMapper mapper = new ModelMapper();
		mapper.createTypeMap(UserDTO.class, User.class)
				.setProvider(p -> userRepo.findById(userDTO.getId()).orElseThrow(NoResultException::new));
		User user = mapper.map(userDTO, User.class);
		user.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));
		userRepo.save(user);
	}

	@Override
	@Transactional
	@CacheEvict(value = CacheNames.CACHE_USER_FIND, allEntries = true)
	public void delete(Integer id) {
		userRepo.deleteById(id);
	}

	@Override
	@Transactional
	@CacheEvict(value = CacheNames.CACHE_USER_FIND, allEntries = true)
	public void deleteAll(List<Integer> ids) {
		userRepo.deleteAllById(ids);
	}

	@Cacheable(CacheNames.CACHE_USER)
	@Override
	public UserDTO getUserByUsername(String username) {
		UserDTO userDTO = userRepo.findByUsername(username).map(user -> convert(user)).orElseThrow(NoResultException::new);
		return userDTO;
	}

	@Cacheable(CacheNames.CACHE_USER)
	@Override
	public UserDTO get(Integer id) {
		UserDTO userDTO = userRepo.findById(id).map(user -> convert(user)).orElseThrow(NoResultException::new);
		return userDTO;
	}

//	@Cacheable(cacheNames = CacheNames.CACHE_USER_FIND, unless = "#result.totalElements == 0", key = "#searchDTO.toString()")
	@Override
	public ResponseDTO<List<UserDTO>> searchByTitle(SearchDTO searchDTO) {
		List<Sort.Order> orders = Optional.ofNullable(searchDTO.getOrders()).orElseGet(Collections::emptyList).stream()
				.map(order -> { // Tạo 1 cái searchDTO dùng chung cho tất ca
					if (order.getOrder().equals(SearchDTO.ASC))
						return Sort.Order.asc(order.getProperty());

					return Sort.Order.desc(order.getProperty());
				}).collect(Collectors.toList());

		Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), Sort.by(orders));

		Page<User> page = userRepo.searchByName(searchDTO.getValue(), pageable);
		ResponseDTO<List<UserDTO>> responseDTO = new ModelMapper().map(page, ResponseDTO.class);
		responseDTO.setData(page.get().map(user -> convert(user)).collect(Collectors.toList()));
		return responseDTO;
	}

	@Override
	public Long countUser() {
		return userRepo.count();
	}
	
	private UserDTO convert(User user) {
		return new ModelMapper().map(user, UserDTO.class);
	}

}