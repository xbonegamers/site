describe('homepage', function() {
  it('should allow a user to enter their gmaertag', function() {
    browser.get('http://localhost:3000/');

    element(by.model('ctrl.gamerTag')).sendKeys('Test');
    element(by.css('#add-tag')).click();
    var text = element(by.repeater('gamer in ctrl.gamers').row(3).column('gamerTag')).getText();
    text.then(function(val) {
      expect(val).toEqual('Test');
    })
  });
});