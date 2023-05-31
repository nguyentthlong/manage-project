package jmaster.io.thesisservice.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Table(name="role")
@Entity
public class Role {
    @Id
    @Column(name = "role_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
}
