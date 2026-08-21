import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

/**
 * Basic E2E Login Functionality Test
 */
async function runLoginTests() {
  // Initialize the browser driver (requires chromedriver to be installed/available)
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    console.log("Starting E2E Login Tests...");

    // Setup: Navigate to local dev server login page
    const baseUrl = 'http://localhost:5173';
    
    // --- Test Case 1: Valid Login (User) ---
    console.log("Running Test Case 1: Valid User Login");
    await driver.get(`${baseUrl}/login`);
    
    // Wait for form to load
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
    
    // Enter credentials
    await driver.findElement(By.css('input[type="email"]')).sendKeys('user@truestyle.security');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('UserPassword123!');
    
    // Submit form
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Assert redirect to home/dashboard
    await driver.wait(until.urlIs(`${baseUrl}/`), 5000);
    console.log("✅ Test Case 1 Passed!");


    // --- Test Case 2: Invalid Login ---
    console.log("Running Test Case 2: Invalid Password");
    await driver.get(`${baseUrl}/login`);
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
    
    await driver.findElement(By.css('input[type="email"]')).sendKeys('user@truestyle.security');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('WrongPassword!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Assert error message appears
    const errorElement = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Invalid email or password')]")), 5000);
    assert.ok(await errorElement.isDisplayed());
    console.log("✅ Test Case 2 Passed!");


    // --- Test Case 3: Empty Fields ---
    console.log("Running Test Case 3: Empty Form Submission");
    await driver.get(`${baseUrl}/login`);
    await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 5000);
    
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    // Because HTML5 'required' attribute prevents default submission, we stay on the same URL
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/login`);
    console.log("✅ Test Case 3 Passed!");


    console.log("All E2E UI Tests Completed Successfully.");

  } catch (error) {
    console.error("❌ E2E Test Failed: ", error);
  } finally {
    // Teardown: Close browser
    await driver.quit();
  }
}

runLoginTests();
