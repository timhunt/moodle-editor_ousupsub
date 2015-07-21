@editor @editor_ousupsub @_bug_phantomjs
Feature: ousupsub superscript button
  To undo a redo text changes in ousupsub, I need to use the undo and redo key combinations.

  @javascript
  Scenario: Verify Undo and redo by adding and formatting some text
    Given I log in as "admin"
    And I am on the integrated "both" editor test page
    #And I set the field "Input" to "Helicopter"
    # Set the initial text
    And I enter the text "Helicopter" in the "Input" ousupsub editor
    Then I should see "Helicopter" in the "Input" ousupsub editor
    And I select the text in the "Input" ousupsub editor

    # Apply superscript and subscript
    When I press the superscript key in the "Input" ousupsub editor
    When I press the subscript key in the "Input" ousupsub editor
    When I press the subscript key in the "Input" ousupsub editor
    Then I should see "<sub>Helicopter</sub>" in the "Input" ousupsub editor

    # Verify undo key works
    When I press the undo key in the "Input" ousupsub editor
    Then I should see "Helicopter" in the "Input" ousupsub editor

    When I press the undo key in the "Input" ousupsub editor
    Then I should see "<sup>Helicopter</sup>" in the "Input" ousupsub editor

    # Verify redo key works
    When I press the redo key in the "Input" ousupsub editor
    Then I should see "Helicopter" in the "Input" ousupsub editor

    When I press the redo key in the "Input" ousupsub editor
    Then I should see "<sub>Helicopter</sub>" in the "Input" ousupsub editor