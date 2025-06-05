package org.example.spring_jwt.dto;

public class ResponseDTO {
    private String status;

    public ResponseDTO(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
