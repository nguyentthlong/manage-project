package jmaster.io.thesisservice.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class FacultyDTO {
    private Integer id;
    private String name;
}