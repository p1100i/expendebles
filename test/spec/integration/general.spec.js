//
// browser.sleep(10000);
//
var
  cleanAppData = function cleanAppData() {
    return browser.executeScript('localStorage.clear();');
  },

  setLastUsedIntervalToSeventeenOctober = function setLastUsedIntervalToSeventeenOctober() {
    return browser.executeScript('localStorage.setItem(\'app.interval\', 1506808800000);');
  },

  navigateToLanding = function navigateToLanding() {
    return browser.get('/');
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

  setMonthBeginOption = function setMonthBeginOption() {
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

  clickElementTimes = function clickElementTimes(selector, times) {
    var
      domElement = element(selector);

    if (!times) {
      times = 1;
    }

    while (times--) {
      domElement.click();
    }
  },

  stepPrevMonth = function stepPrevMonth(times) {
    clickElementTimes(by.css('[title="Previous month"]'), times);
  },

  stepNextMonth = function stepNextMonth(times) {
    clickElementTimes(by.css('[title="Next month"]'), times);
  },

  toggleBalancing = function toggleBalancing() {
    clickElementTimes(by.css('.toggle-balance'));
  },

  startEdit = function startEdit() {
    clickElementTimes(by.css('.edit'));
  },

  finishEdit = function finishEdit() {
    clickElementTimes(by.css('[title="Done"]'));
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

  expectRegisterHasTransaction = function expectRegisterHasTransaction(amount) {
    var
      item = element(by.css('table.transactions tr td.amount-cell'));

    expect(item.getText()).toBe(amount);
  },

  expectPresent = function expectPresent(selector, value) {
    if (value === undefined) {
      value = true;
    }

    var
      domElement = element(selector);

    expect(domElement.isPresent()).toBe(value);
  },

  expectRegisterHasTransactions = function expectRegisterHasTransactions(value) {
    expectPresent(by.css('table.transactions'), value);
  },

  expectRegisterHasBalances = function expectRegisterHasBalances(value) {
    expectPresent(by.css('table.balances'), value);
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

    expectRegisterHasTransactions(false);

    stepPrevMonth();

    expect(getIntervalTitle()).toBe('\'17 Aug');

    expectRegisterHasTransactions();
    expectRegisterHasTransaction('111');
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

    stepNextMonth(4);

    expect(getIntervalTitle()).toBe('\'18 Jan');
    expect(getIntervalSubtitle()).toBe('01.01-01.31');
  },

  testRegisteredItemUpdate = function testRegisteredItemUpdate() {
    expect(getIntervalTitle()).toBe('\'17 Aug');

    expectRegisterHasTransactions(false);

    stepNextMonth();

    expectRegisterHasTransactions();
    expectRegisterHasTransaction('111');
  },

  addItemsAndBalancesToMonthAndNextMonth = function addItemsAndBalancesToMonthAndNextMonth() {
    setAmount('1000');

    // Set the balancing to 1100 debt.
    toggleBalancing();
    setAmount('1100');

    // Balancing off.
    toggleBalancing();

    setAmount('500');

    stepNextMonth();
    setAmount('10');

    // Balancing on.
    toggleBalancing();

    // Set the balancing to 2000 debt.
    setAmount('2000');
    toggleBalancing();

    // First month vs second month
    //
    // Trans         Trans
    // -1000           -10
    //  -500
    //  ====          ====
    // -1500           -10
    //
    // Blanc         Blanc
    // -1100         -2000
    //
  },

  getUnregistered = function getUnregistered() {
    var
      amountUnregistered = element(by.css('.amount-unregistered'));

    return {
      'amount'  : amountUnregistered.getText(),
      'income'  : element(by.css('.amount-unregistered .income')).isPresent()
    };
  },

  testNoUnregistered = function testNoUnregistered() {
    expect(element(by.css('.amount-unregistered')).isPresent()).toBe(false);
  },

  testUnregisteredCalculation = function testUnregisteredCalculation(amount, isIncome) {
    var
      unregistered = getUnregistered();

    expect(unregistered.amount).toBe(amount);
    expect(unregistered.income).toBe(isIncome);
  };

describe('general', function () {
  beforeEach(function () {
    navigateToLanding()
      .then(cleanAppData)
      .then(setLastUsedIntervalToSeventeenOctober);
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

    describe('with registration w/ transactions and balances in december/january', function () {
      beforeEach(function () {
        navigateToRegister()
          .then(stepNextMonth.bind(null, 2))
          .then(addItemsAndBalancesToMonthAndNextMonth);
      });

      describe('with checking decembers statistics', function () {
        beforeEach(function () {
          navigateToStatistics().then(stepPrevMonth);
        });

        it('should display unregistered amount for december', function () {
          testUnregisteredCalculation('600', true);
        });
      });

      describe('with checking next years december', function () {
        beforeEach(function () {
          stepNextMonth(11);
        });

        it('should not display them for next year', function () {
          expectRegisterHasTransactions(false);
          expectRegisterHasBalances(false);
        });
      });
    });

    describe('with custom month begin options', function () {
      beforeEach(function () {
        navigateToConfig().then(setMonthBeginOption);
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
      var
        expectations = function expectations() {
          expect(getIntervalTitle()).toBe('\'17 Nov');

          testNoUnregistered();
          stepPrevMonth();

          testUnregisteredCalculation('600', true);
          stepPrevMonth();

          testNoUnregistered();
        };

      navigateToRegister()
        .then(addItemsAndBalancesToMonthAndNextMonth)
        .then(navigateToStatistics)
        .then(expectations);
    });
  });
});
