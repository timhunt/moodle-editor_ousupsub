@editor @editor_ousupsub @_bug_phantomjs
Feature: ousupsub subscript button
  To format text in ousupsub, I need to use the subscript keys.

  @javascript
  Scenario: Apply Subscript some text
    Given I log in as "admin"
    And I am on the integrated "sub" editor test page
    Then ".[contains(@title, 'Shift + _ or Down arrow')]" "xpath_element" should exist in the "button.ousupsub_subscript_button_subscript" "css_element"

    When I set the field "Input" to "Helicopter"
    And I select the text in the "Input" ousupsub editor

    # Verify button 95(Down arrow) applies subscript
    And I press the key "95" in the "Input" ousupsub editor
    Then I should see "<sub>Helicopter</sub>" in the "Input" ousupsub editor

    # Verify cannot add further subscript
    When I press the key "95" in the "Input" ousupsub editor
    Then I should see "<sub>Helicopter</sub>" in the "Input" ousupsub editor

    # Verify button 94(Up arrow) removes subscript
    And I press the key "94" in the "Input" ousupsub editor
    Then I should see "Helicopter" in the "Input" ousupsub editor

    # Verify button 94(Up arrow) cannot apply superscript
    And I press the key "94" in the "Input" ousupsub editor
    Then I should see "Helicopter" in the "Input" ousupsub editor

    # Verify button 40(_) applies subscript
    When I set the field "Input" to "Helicopter"
    And I select the text in the "Input" ousupsub editor
    And I press the key "40" in the "Input" ousupsub editor
    Then I should see "<sub>Helicopter</sub>" in the "Input" ousupsub editor

    # Verify button 38(^) removes subscript
    And I press the key "38" in the "Input" ousupsub editor
    Then I should see "Helicopter" in the "Input" ousupsub editor
