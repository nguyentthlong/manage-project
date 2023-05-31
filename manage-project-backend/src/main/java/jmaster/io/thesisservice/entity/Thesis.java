package jmaster.io.thesisservice.entity;

import javax.persistence.*;

import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Thesis {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String title;
	
	private String description;

	@Column(name = "Status")
	private String status;

	@Column(name = "StartDate")
	@Temporal(TemporalType.DATE)
	private Date startDate;

	@Column(name = "EndDate")
	@Temporal(TemporalType.DATE)
	private Date endDate;
	
	@ManyToOne
	private Teacher teacher;
	
	@ManyToOne
	private Student student;
}
