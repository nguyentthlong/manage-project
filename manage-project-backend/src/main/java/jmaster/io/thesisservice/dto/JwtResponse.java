package jmaster.io.thesisservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private Integer id;
    private String username;
    private String email;
    private String phoneNumber;
    private List<String> roles;

    public JwtResponse(String accessToken, String refreshToken, Integer id, String username, List<String> roles) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }
}
