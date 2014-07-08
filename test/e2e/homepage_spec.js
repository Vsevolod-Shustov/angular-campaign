describe('homepage', function() {
  beforeEach(function() {
    browser.get('http://localhost:8000/index.html');
  });

  it('should load the home page', function() {
    expect(browser.getTitle()).toBe('Campaign');
  });
});