@editor @editor_ousupsub @_bug_phantomjs
Feature: ousupsub superscript button
  To undo a redo text changes in ousupsub, I need to use the undo and redo key combinations.

  @javascript
  Scenario: Verify Undo and redo by adding and formatting some text
    Given I log in as "admin"
    And I am on the integrated "both" editor test page
    # Set the initial text
    And I paste the text "Helicopter" in the "Input" ousupsub editor
    Then I should see "Helicopter" in the "Input" ousupsub editor
