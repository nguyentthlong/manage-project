package jmaster.io.thesisservice.entity;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.CreatedDate;

import lombok.Data;


@Data
@Entity
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
    
    @CreatedDate
	private Date createdAt;
}
