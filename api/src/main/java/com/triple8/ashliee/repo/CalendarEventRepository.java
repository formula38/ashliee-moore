package com.triple8.ashliee.repo;

import com.triple8.ashliee.domain.CalendarEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByPubliclyViewableTrueOrderByEventDateAsc();
    List<CalendarEvent> findAllByOrderByEventDateAsc();
}
