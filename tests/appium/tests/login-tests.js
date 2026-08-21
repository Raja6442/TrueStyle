import { remote } from 'webdriverio';
import assert from 'assert';

/**
 * Basic Appium E2E Login Functionality Test for Mobile
 */
async function runMobileLoginTests() {
  // Mobile Capabilities config
  const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    // 'My Device' tells Appium to just use whatever phone is plugged in via USB
    'appium:deviceName': 'My Device',
    
    // For this example, we test the mobile web view via Chrome on Android
    browserName: 'Chrome',
  };

  const wdOpts = {
    hostname: '127.0.0.1',
    port: 4723, // Default Appium server port
    logLevel: 'error',
    capabilities,
  };

  let driver;

  try {
    console.log("Starting Appium E2E Mobile Login Tests...");
    console.log("Make sure Appium Server is running on port 4723 and your phone is plugged in via USB!");
    
    driver = await remote(wdOpts);

    // Because of 'adb reverse', we can now just use 127.0.0.1!
    const baseUrl = 'http://127.0.0.1:5173';
    
    // --- Test Case 1: Valid Mobile Login ---
    console.log("Running Test Case 1: Valid Mobile User Login");
    await driver.url(`${baseUrl}/login`);
    
    const emailInput = await driver.$('input[type="email"]');
    await emailInput.waitForDisplayed({ timeout: 10000 });
    await emailInput.setValue('user@truestyle.security');

    const passwordInput = await driver.$('input[type="password"]');
    await passwordInput.setValue('UserPassword123!');
    
    // Hide virtual keyboard on mobile if it covers the submit button
    if (await driver.isKeyboardShown()) {
      await driver.hideKeyboard();
    }

    const submitBtn = await driver.$('button[type="submit"]');
    await submitBtn.click();
    
    // Assert redirect to home/dashboard
    await driver.waitUntil(
        async () => (await driver.getUrl()) === `${baseUrl}/`,
        { timeout: 5000, timeoutMsg: 'expected redirect to home after 5s' }
    );
    console.log("✅ Test Case 1 Passed!");


    // --- Test Case 2: Invalid Mobile Login ---
    console.log("Running Test Case 2: Invalid Password");
    await driver.url(`${baseUrl}/login`);
    
    await emailInput.waitForDisplayed({ timeout: 5000 });
    await emailInput.setValue('user@truestyle.security');
    await passwordInput.setValue('WrongPassword!');
    
    if (await driver.isKeyboardShown()) {
      await driver.hideKeyboard();
    }
    await submitBtn.click();
    
    // Assert error message appears
    const errorElement = await driver.$('//span[contains(text(), "Invalid email or password")]');
    await errorElement.waitForDisplayed({ timeout: 5000 });
    assert.ok(await errorElement.isDisplayed());
    console.log("✅ Test Case 2 Passed!");

    console.log("All Appium E2E UI Tests Completed Successfully.");

  } catch (error) {
    console.error("❌ Appium Test Failed: ", error.message);
  } finally {
    if (driver) {
      await driver.deleteSession();
    }
  }
}

runMobileLoginTests();
