package com.example.staylio_backend.service.impl.admin.helper;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.model.entity.Voucher;
import com.example.staylio_backend.model.enums.DiscountType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class BookingPricingService {

    public BigDecimal calculateDiscount(BigDecimal originalPrice, Voucher voucher) {
        if (voucher.getMinOrderValue() != null
                && originalPrice.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new AppException(ErrorCode.MIN_ORDER_NOT_REACHED);
        }

        BigDecimal discountAmount;

        if (voucher.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = originalPrice
                    .multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discountAmount = voucher.getDiscountValue();
        }

        if (voucher.getMaxDiscountAmount() != null
                && discountAmount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
            discountAmount = voucher.getMaxDiscountAmount();
        }

        if (discountAmount.compareTo(originalPrice) > 0) {
            discountAmount = originalPrice;
        }

        return discountAmount;
    }
}
