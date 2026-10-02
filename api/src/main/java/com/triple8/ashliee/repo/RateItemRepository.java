package com.triple8.ashliee.repo;

import com.triple8.ashliee.domain.RateItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RateItemRepository extends JpaRepository<RateItem, Long> {
    List<RateItem> findAllByOrderBySortOrderAsc();
}
