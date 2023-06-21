package jmaster.io.thesisservice.dto;

import lombok.Data;

@Data
public class ClassesDTO {
    private Integer id;

    private String name;
    
    private MajorDTO major;
    
    private TeacherDTO teacher;
    
}
