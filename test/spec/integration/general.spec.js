var
  testSettingMonthBeginOption = function testSettingMonthBeginOption() {
    var
      monthBeg        = element(by.model('config.monthBeg')),
      monthBegOption  = monthBeg.element(by.cssContainingText('option', '15'));

    monthBegOption.click();

    return browser.get('/#!/register');
  },

  testRegisterAddAndEdit= function testRegisterAddAndEdit() {
    var
      done,
      input,
      selected,
      showedInterval,
      amount  = element(by.id('amount')),
      edit    = element(by.css('.edit')),
      left    = element(by.css('[title="Previous month"]'));

    left.click();

    amount.sendKeys('111');

    edit.click();

    input           = element(by.model('register.selectedItem.date'));
    showedInterval  = element(by.binding('app.interval.title'));

    expect(showedInterval.getText()).toBe('\'17 Sep');

    input.sendKeys('09/10/2017' + protractor.Key.TAB + '08:40');

    selected = element(by.css('tr.selected td.amount-cell'));

    expect(selected.getText()).toBe('111');

    expect(showedInterval.getText()).toBe('\'17 Sep');

    done = element(by.css('[title="Done"]'));

    done.click();

    expect(element(by.css('table.items')).isPresent()).toBe(false);

    left.click();

    expect(showedInterval.getText()).toBe('\'17 Aug');

    expect(element(by.css('table.items')).isPresent()).toBe(true);
    expect(element(by.css('table.items tr td.amount-cell')).getText()).toBe('111');

    return browser.get('/#!/config');
  },

  testSerializationWithReconfiguration = function testSerializationWithReconfiguration() {
    var
      monthBeg            = element(by.model('config.monthBeg')),
      monthBegOption      = monthBeg.element(by.cssContainingText('option', '8')),
      monthBegLateOption  = monthBeg.element(by.cssContainingText('option', '20')),
      copyButton          = element(by.buttonText('Copy')),
      importButton        = element(by.buttonText('Import')),
      clearButton         = element(by.buttonText('Clear all APP data!')),
      serializedArea      = element(by.css('textarea.serialized')),
      serializedText      = serializedArea.getAttribute('value');

    monthBegOption.click();
    copyButton.click();

    clearButton.click();

    browser.switchTo().alert().accept();

    monthBegLateOption.click();

    expect(serializedText).not.toBe(serializedArea.getAttribute('value'));

    serializedArea.clear();

    serializedArea.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'v'));

    importButton.click();

    expect(monthBeg.getAttribute('value')).toEqual('number:7');

    return browser.get('/#!/register');
  },

  testRegisteredItemUpdate = function testRegisteredItemUpdate() {
    var
      showedInterval  = element(by.binding('app.interval.title')),
      right           = element(by.css('[title="Next month"]'));


    expect(showedInterval.getText()).toBe('\'17 Aug');

    expect(element(by.css('table.items')).isPresent()).toBe(false);

    right.click();

    expect(element(by.css('table.items tr td.amount-cell')).getText()).toBe('111');
  };

describe('page', function () {
  it('should have the title', function () {
    browser.get('/');

    expect(browser.getTitle()).toEqual('expendebles');

    browser.executeScript('localStorage.setItem(\'app.interval\', 1506808800000);');
  });
});

describe('register', function () {
  it('should keep data for serialization up-to-date and display updated data on config change', function () {
    browser.get('/#!/config')
      .then(testSettingMonthBeginOption)
      .then(testRegisterAddAndEdit)
      .then(testSerializationWithReconfiguration)
      .then(testRegisteredItemUpdate)
  });
});
