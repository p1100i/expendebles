var
  setLastUsedInterval = function setLastUsedInterval() {
    browser.executeScript('localStorage.setItem(\'app.interval\', 1506808800000);');
  },

  navigateToLanding = function navigateToLanding() {
    browser.get('/');
  },

  navigateToRegister = function navigateToRegister() {
    return browser.get('/#!/register');
  },

  navigateToStatistics = function navigateToStatistics() {
    return browser.get('/#!/statistic');
  },

  navigateToConfig = function navigateToConfig() {
    return browser.get('/#!/config');
  },

  testSettingMonthBeginOption = function testSettingMonthBeginOption() {
    var
      monthBeg        = element(by.model('config.monthBeg')),
      monthBegOption  = monthBeg.element(by.cssContainingText('option', '15'));

    monthBegOption.click();
  },

  setAmount = function setAmount(value) {
    var
      amount = element(by.id('amount'));

    amount.sendKeys(value);
  },

  setDate = function setDate(year, month, day, hour, minute) {
    var
      input = element(by.model('register.selectedItem.date'));

    //
    // In my case US locale was set in the chrome process,
    // however it may resurface as an issue, that during
    // e2e test execution the users browser has a different
    // locale setting.
    //
    input.sendKeys([day, month, year].join('/') + protractor.Key.TAB + hour + ':' + minute);
  },

  stepPrevMonth = function stepPrevMonth() {
    var
      left= element(by.css('[title="Previous month"]'));

    left.click();
  },

  stepNextMonth = function stepNextMonth() {
    var
      right = element(by.css('[title="Next month"]'));

    right.click();
  },

  toggleBalancing = function toggleBalancing() {
    var
      balanceToggle = element(by.css('.toggle-balance'));

    balanceToggle.click();
  },

  startEdit = function startEdit() {
    var
      edit = element(by.css('.edit'));

    edit.click();
  },

  finishEdit = function finishEdit() {
    var
      done = element(by.css('[title="Done"]'));

    done.click();
  },

  getSelectedText = function getSelectedText() {
    return element(by.css('tr.selected td.amount-cell')).getText();
  },

  getIntervalTitle = function getIntervalTitle() {
    return element(by.binding('app.interval.title')).getText();
  },

  getIntervalSubtitle = function getIntervalSubtitle() {
    return element(by.binding('app.interval.subtitle')).getText();
  },

  expectRegisterHasItem = function expectRegisterHasItem(amount) {
    var
      item = element(by.css('table.items tr td.amount-cell'));

    expect(item.getText()).toBe(amount);
  },

  expectRegisterHasItems = function expectRegisterHasItems(expectedValue) {
    var
      items = element(by.css('table.items'));

    expect(items.isPresent()).toBe(expectedValue);
  },

  testRegisterAddAndEdit= function testRegisterAddAndEdit() {
    stepPrevMonth();
    setAmount('111');
    startEdit();

    expect(getIntervalTitle()).toBe('\'17 Sep');

    setDate('2017', '10', '09', '08', '40');

    expect(getSelectedText()).toBe('111');
    expect(getIntervalTitle()).toBe('\'17 Sep');

    finishEdit();

    expectRegisterHasItems(false);

    stepPrevMonth();

    expect(getIntervalTitle()).toBe('\'17 Aug');

    expectRegisterHasItems(true);
    expectRegisterHasItem('111');
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
  },

  testIntervalDisplay = function testIntervalDisplay() {
    expect(getIntervalTitle()).toBe('\'17 Oct');
    expect(getIntervalSubtitle()).toBe('10.01-10.31');

    stepPrevMonth();

    expect(getIntervalTitle()).toBe('\'17 Sep');
    expect(getIntervalSubtitle()).toBe('09.01-09.30');

    stepNextMonth();
    stepNextMonth();
    stepNextMonth();
    stepNextMonth();

    expect(getIntervalTitle()).toBe('\'18 Jan');
    expect(getIntervalSubtitle()).toBe('01.01-01.31');
  },

  testRegisteredItemUpdate = function testRegisteredItemUpdate() {
    expect(getIntervalTitle()).toBe('\'17 Aug');

    expectRegisterHasItems(false);

    stepNextMonth();

    expectRegisterHasItems(true);
    expectRegisterHasItem('111');
  },

  testAddingItemsToMonths = function testAddingItemsToMonths() {
    setAmount('1000');

    toggleBalancing();
    // Set the balancing to 1100 debt.
    setAmount('1100');
    toggleBalancing();

    setAmount('500');

    stepNextMonth();
    setAmount('10');

    toggleBalancing();
    // Set the balancing to 2000 debt.
    setAmount('2000');
    toggleBalancing();

    stepPrevMonth();
  },

  testUnregisteredCalculation = function testUnregisteredCalculation() {
    var
      unregisteredAmount        = element(by.css('.amount-unregistered')).getText(),
      unregisteredAmountIncome  = element(by.css('.amount-unregistered .income')).isPresent();

    expect(getIntervalTitle()).toBe('\'17 Oct');
    expect(unregisteredAmount).toBe('600');
    expect(unregisteredAmountIncome).toBe(true);

  };

describe('general', function () {
  beforeEach(function () {
    navigateToLanding();
    setLastUsedInterval();
  });

  describe('landing page', function () {
    it('should have the title', function () {
      expect(browser.getTitle()).toEqual('expendebles');
    });
  });

  describe('register', function () {
    it('should display correct intervals', function () {
      navigateToRegister().then(testIntervalDisplay);
    });

    describe('with custom month begin options', function () {
      beforeEach(function () {
        navigateToConfig().then(testSettingMonthBeginOption);
      });

      it('should keep data for serialization up-to-date and display updated data on config change', function () {
        navigateToRegister()
          .then(testRegisterAddAndEdit)
          .then(navigateToConfig)
          .then(testSerializationWithReconfiguration)
          .then(navigateToRegister)
          .then(testRegisteredItemUpdate);
      });
    });
  });

  describe('statistics', function () {
    it('should display unregistered differences between months', function () {
      navigateToRegister()
        .then(testAddingItemsToMonths)
        .then(navigateToStatistics)
        .then(testUnregisteredCalculation);
    });
  });
});
