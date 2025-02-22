package com.gucardev.utility.infrastructure.usecase;

// 2. UseCase interface with return value
public interface UseCaseWithReturn<R> {
    R execute();
}
