package jmaster.io.thesisservice.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Data;

@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class CreateAuditable {

	@CreatedBy
	@JoinColumn(name = "created_by", updatable = false)
	@ManyToOne
	private User createdBy;
	
	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_date", updatable = false)
	private Date createdDate;

}
