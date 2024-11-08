package com.gucardev.rediscachingexample.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.gucardev.rediscachingexample.infra.CacheConstants.CUSTOMER_CACHE_NAME;


import org.springframework.cache.annotation.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Cacheable(value = CUSTOMER_CACHE_NAME, key = "'allCustomers'")
    public List<Customer> getAllCustomers() {
        log.info("Fetching all customers from the database");
        return customerRepository.findAll();
    }

    @Cacheable(value = CUSTOMER_CACHE_NAME, key = "#id")
    public Optional<Customer> getCustomerById(Long id) {
        log.info("Fetching customer with ID: {} from the database", id);
        return customerRepository.findById(id);
    }

    @Caching(
            put = {@CachePut(value = CUSTOMER_CACHE_NAME, key = "#result.id")},
            evict = {@CacheEvict(value = CUSTOMER_CACHE_NAME, key = "'allCustomers'")}
    )
    public Customer createCustomer(Customer customer) {
        log.info("Creating customer with name: {}", customer.getName());
        return customerRepository.save(customer);
    }

    @Caching(
            put = {@CachePut(value = CUSTOMER_CACHE_NAME, key = "#customer.id")},
            evict = {@CacheEvict(value = CUSTOMER_CACHE_NAME, key = "'allCustomers'")}
    )
    public Customer updateCustomer(Customer customer) {
        log.info("Updating customer with ID: {}", customer.getId());
        var existingCustomer = customerRepository.findById(customer.getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        existingCustomer.setName(customer.getName());
        return customerRepository.save(existingCustomer);
    }

    @Caching(
            evict = {
                    @CacheEvict(value = CUSTOMER_CACHE_NAME, key = "#id"),
                    @CacheEvict(value = CUSTOMER_CACHE_NAME, key = "'allCustomers'")
            }
    )
    public void deleteCustomer(Long id) {
        log.info("Deleting customer with ID: {}", id);
        customerRepository.deleteById(id);
    }

    @CacheEvict(value = CUSTOMER_CACHE_NAME, allEntries = true)
    public void evictAllCache() {
        log.info("Evicting all entries from the customer cache");
    }
}


