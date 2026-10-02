Feature: Public calendar
  Scenario: A private event stays off the public list
    When the API hides private events
    Then a private title is absent from the public payload
