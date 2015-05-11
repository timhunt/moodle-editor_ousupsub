@editor @editor_ousupsub @_bug_phantomjs
Feature: ousupsub subscript button
  To format text in ousupsub, I need to use the subscript button.

  @javascript
  Scenario: Subscript some text
    Given I am on the integrated "sub" editor test page
    And I set the field "Input" to "Submarine"
    And I select the text in the "Input" ousupsub editor
    When I click on "Subscript" "button"
    Then I should see "<sub>Submarine</sub>" in the "Input" ousupsub editor

    # Apply subscript inside existing Subscript 
    When I select the range "'sub',2,'sub',5" in the "Input" ousupsub editor
    And I click on "Subscript" "button"
    #And I pause
    Then I should see "<sub>Su</sub>bma<sub>rine</sub>" in the "Input" ousupsub editor
    
    # Revert Subscript 
    And I click on "Subscript" "button"
    Then I should see "<sub>Submarine</sub>" in the "Input" ousupsub editor