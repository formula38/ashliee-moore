Feature: Talent desk
  Scenario: A visitor books a modeling date
    When a visitor posts an inquiry for "Modeling" in "Sacramento"
    Then the inquiry is stored

  Scenario: A saved lead is still there after another read
    Given an operator is signed in
    When the operator saves a lead named "Still here"
    Then listing leads includes "Still here"

  Scenario: A private hold does not appear on the public calendar
    Given an operator is signed in
    When the operator saves a private event titled "Secret fitting"
    Then the public calendar does not list "Secret fitting"
