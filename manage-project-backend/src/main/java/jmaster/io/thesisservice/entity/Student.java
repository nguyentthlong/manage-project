package jmaster.io.thesisservice.entity;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jmaster.io.thesisservice.entity.User;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(callSuper = false)
public class Student extends CreateAuditable {
	@Id
    private Integer id;
    @Column(unique = true)
    @NotBlank
    @Size(max=20)
    private String studentCode;
    
    @OneToOne(cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	@MapsId
    private User user;
    
    @ManyToOne
    private Major major;
    
    @ManyToOne
    private Classes studentClass;
    
    @CreatedDate
	private Date createdAt;

}
