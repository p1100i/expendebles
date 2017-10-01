describe('/', function () {
  // it('should have the title', function () {
  //   browser.get('/');

  //   expect(browser.getTitle()).toEqual('expendebles');
  // });

  it('should work', function () {
    browser.get('/#!/data').then(function () {
      var
        monthBeg        = element(by.model('data.monthBeg')),
        monthBegOption  = monthBeg.element(by.cssContainingText('option', '15'));

      monthBegOption.click();

      return browser.get('/#!/register');
    }).then(function () {
      var
        amount  = element(by.id('amount')),
        edit    = element(by.css('.edit')),
        left    = element(by.css('[title="Previous month"]'));

      amount.sendKeys('111');

      edit.click();

      var
        input           = element(by.model('register.selectedItem.date')),
        showedInterval  = element(by.binding('app.interval.title'));

      expect(showedInterval.getText()).toBe('Sep');

      // browser.sleep(1000);

      input.sendKeys('09/10/2017' + protractor.Key.TAB + '08:40');

      expect(showedInterval.getText()).toBe('Aug');

      // browser.sleep(1000);

      // var
      //   done = element(by.css('[title="Done"]'));

      // done.click();

      // browser.sleep(1000);

      // left.click();

      // browser.sleep(2000);
    });
  });
});
