@editor @editor_ousupsub @_bug_phantomjs
Feature: ousupsub superscript button
  To format text in ousupsub, I need to use the superscript button.

  @javascript
  Scenario: Subscript some text
    Given I am on the integrated "sup" editor test page
    And I set the field "Input" to "Helicopter"
    And I select the text in the "Input" ousupsub editor
    When I click on "Superscript" "button"
    Then I should see "<sup>Helicopter</sup>" in the "Input" ousupsub editor
