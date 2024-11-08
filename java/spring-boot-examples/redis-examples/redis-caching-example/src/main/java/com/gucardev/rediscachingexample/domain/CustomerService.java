package com.gucardev.rediscachingexample.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        log.info("Fetching all customers from the database");
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        log.info("Fetching customer with ID: {} from the database", id);
        return customerRepository.findById(id);
    }

    public void createCustomer(Customer customer) {
        log.info("Creating customer with name: {}", customer.getName());
        customerRepository.save(customer);
    }

    public void updateCustomer(Customer customer) {
        log.info("Updating customer with ID: {}", customer.getId());
        var existingCustomer = customerRepository.findById(customer.getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        existingCustomer.setName(customer.getName());
        customerRepository.save(existingCustomer);
    }

    public void deleteCustomer(Long id) {
        log.info("Deleting customer with ID: {}", id);
        customerRepository.deleteById(id);
    }

    public void evictAllCache() {
        log.info("Evicting all entries from the customer cache");
    }
}

