package com.gucardev.springsecurityjwtexample.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tokens")
@Getter
@Setter
public class Token extends BaseEntity {

  private String tokenSign;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  private Date refreshTokenExpiration;

  private String refreshToken;

  private Date otpExpiration;

  private Integer otpCode;

  private Boolean otpValidated = false;
}
