package com.triple8.ashliee.repo;

import com.triple8.ashliee.domain.Look;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LookRepository extends JpaRepository<Look, Long> {
    List<Look> findBySectionOrderBySortOrderAsc(String section);
    List<Look> findAllByOrderBySectionAscSortOrderAsc();
}
