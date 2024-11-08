package com.gucardev.rediscachingexample.domain;

import com.gucardev.rediscachingexample.infra.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    // Cache the list of all customers
    @Cacheable(value = Constants.CUSTOMER_CACHE_NAME, key = "'allCustomers'")
    public List<Customer> getAllCustomers() {
        log.info("Fetching all customers from the database");
        return customerRepository.findAll();
    }

    // Cache individual customer by ID
    @Cacheable(value = Constants.CUSTOMER_CACHE_NAME, key = "#id")
    public Optional<Customer> getCustomerById(Long id) {
        log.info("Fetching customer with ID: {} from the database", id);
        return customerRepository.findById(id);
    }

    // Update caches when a new customer is created
    @CacheEvict(value = Constants.CUSTOMER_CACHE_NAME, key = "'allCustomers'")
    @CachePut(value = Constants.CUSTOMER_CACHE_NAME, key = "#result.id")
    public Customer createCustomer(Customer customer) {
        log.info("Creating customer with name: {}", customer.getName());
        return customerRepository.save(customer);
    }

    // Update caches when a customer is updated
    @CacheEvict(value = Constants.CUSTOMER_CACHE_NAME, key = "'allCustomers'")
    @CachePut(value = Constants.CUSTOMER_CACHE_NAME, key = "#customer.id")
    public Customer updateCustomer(Customer customer) {
        log.info("Updating customer with ID: {}", customer.getId());
        var existingCustomer = customerRepository.findById(customer.getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        existingCustomer.setName(customer.getName());
        return customerRepository.save(existingCustomer);
    }

    // Evict caches when a customer is deleted
    //key = "#id" => instead allEntries maybe we can evict by key
    @CacheEvict(value = Constants.CUSTOMER_CACHE_NAME, allEntries = true)
    public void deleteCustomer(Long id) {
        log.info("Deleting customer with ID: {}", id);
        customerRepository.deleteById(id);
    }

    // Evict all cache entries
    @CacheEvict(value = Constants.CUSTOMER_CACHE_NAME, allEntries = true)
    public void evictAllCache() {
        log.info("Evicting all entries from the customer cache");
    }
}
