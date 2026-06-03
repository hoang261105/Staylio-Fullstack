package com.example.staylio_backend.common.base;

import com.example.staylio_backend.dto.response.page.PaginationResponse;

import java.io.IOException;

public interface BaseService<RQ, RS, ID> {
    PaginationResponse<RS> findAll(String search, int page, int size, String sortBy, String direction);

    RS findById(ID id);
    RS create(RQ request) ;
    RS update(ID id, RQ request);
    void delete(ID id);
}
