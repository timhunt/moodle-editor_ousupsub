@editor @editor_ousupsub @_bug_phantomjs
Feature: ousupsub invisible characters
  Formatting text in ousupsub adds invisible characters to the text. These must be removed 
  as soon as they are no longer needed.

  @javascript
  Scenario: Add superscript inside a string and move along it.
    Given I log in as "admin"
    And I am on the integrated "both" editor test page
    And I set the field "Input" to "Helicopter"

    # Apply superscript
    And I click on "Superscript" "button"

    # Verify &#65279; present and correct
    Then I should see character "65279" in the raw html of the "Input" ousupsub editor
    # Move caret left: press left arrow key
    When I press the "left arrow" key in the "Input" ousupsub editor

    # Verify &#65279; not present
    Then I should not see character "65279" in the raw html of the "Input" ousupsub editor

    # Verify multiple &#65279; characters are removed
    When I click on "Superscript" "button"
    And I set the caret position to "'', 7" in the "Input" ousupsub editor
    And I click on "Superscript" "button"
    Then I should see character "65279" in the raw html of the "Input" ousupsub editor
    When I press the "left arrow" key in the "Input" ousupsub editor
    Then I should not see character "65279" in the raw html of the "Input" ousupsub editor