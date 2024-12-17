package org.gucardev.entityencryption.config;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.gucardev.entityencryption.dto.CreateAddressRequest;
import org.gucardev.entityencryption.entity.Address;
import org.gucardev.entityencryption.entity.User;
import org.gucardev.entityencryption.service.AddressService;
import org.gucardev.entityencryption.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialDataPopulate implements CommandLineRunner {

  private final UserService userService;

  @Override
  public void run(String... args) throws Exception {

    var user = new User();
    user.setName("user");
    user.setUsername("@username");

    var address = new Address();
    address.setCity("Istanbul");
    address.setCountry("Turkey");
    address.setStreet("street 352");
    address.setUser(user);

    var address2 = new Address();
    address2.setCity("Ankara");
    address2.setCountry("Turkey");
    address2.setStreet("street 124");
    address2.setUser(user);

    user.setAddresses(List.of(address, address2));

    userService.createUser(user);


//    var user = new User();
//    user.setName("user");
//    user.setUsername("@username");
//    user = userService.createUser(user);
//    var address = new CreateAddressRequest();
//    address.setCity("Istanbul");
//    address.setCountry("Turkey");
//    address.setStreet("street 352");
//    address.setUserId(user.getId());
//    var address2 = new CreateAddressRequest();
//    address2.setCity("Ankara");
//    address2.setCountry("Turkey");
//    address2.setStreet("street 124");
//    address2.setUserId(user.getId());
//    addressService.createAddress(address);
//    addressService.createAddress(address2);

  }
}
