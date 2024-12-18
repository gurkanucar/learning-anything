package org.gucardev.mailsending;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class TemplateController {


  @GetMapping("/verify/{token}")
  public String verifyAccount(@PathVariable("token") String token, Model model) {
    // TODO: Add logic to validate the token, e.g., check in the database if it's valid.
    boolean isTokenValid = true; // Replace this with your actual token validation logic.

    if (isTokenValid) {
      // Pass any required attributes to the template if needed.
      model.addAttribute("message", "Your account has been successfully verified!");
      return "account-validation-success"; // Renders account-validation-success.html from templates folder.
    } else {
      // Redirect or render an error page if the token is invalid.
      model.addAttribute("errorMessage", "Invalid or expired verification token.");
      return "account-validation-error"; // Optionally create an error page.
    }
  }

}
