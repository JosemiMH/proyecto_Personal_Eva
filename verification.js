
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport to a standard desktop size
    await page.setViewportSize({ width: 1280, height: 1024 });

    console.log('Navigating to localhost:5000...');
    try {
        await page.goto('http://localhost:5000', { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Wait a bit more for client-side hydration
        await page.waitForTimeout(3000);
    } catch (e) {
        console.error('Failed to load page:', e);
        await browser.close();
        process.exit(1);
    }

    // Ensure screenshots directory exists
    const screenshotDir = path.join(__dirname, 'verification_screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    try {
        console.log('Taking screenshot of Portfolio section...');
        // Wait for ANY content to load first
        await page.waitForSelector('body');

        // Try to find portfolio section
        const portfolioSection = page.locator('#portfolio');
        await portfolioSection.waitFor({ state: 'visible', timeout: 10000 });
        await portfolioSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotDir, 'portfolio_section.png') });

        console.log('Opening Project Modal...');
        // Find the first button inside the portfolio section that looks like "Ver caso completo" or similar
        // We'll target the motion.div's button or the first button in the grid
        const projectButton = portfolioSection.locator('button').first();
        if (await projectButton.isVisible()) {
            await projectButton.click();
            // Wait for dialog content to appear
            const dialogContent = page.locator('[role="dialog"]');
            await dialogContent.waitFor({ state: 'visible', timeout: 5000 });
            await page.waitForTimeout(1000); // Wait for animation
            await page.screenshot({ path: path.join(screenshotDir, 'project_modal.png') });

            // Close modal
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1000);
        } else {
            console.log('Could not find project button');
        }

        console.log('Taking screenshot of Services section...');
        const servicesSection = page.locator('#services');
        await servicesSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotDir, 'services_section.png') });

        console.log('Opening Service Modal...');
        const serviceButton = servicesSection.locator('button').first();
        if (await serviceButton.isVisible()) {
            await serviceButton.click();
            const dialogContent = page.locator('[role="dialog"]');
            await dialogContent.waitFor({ state: 'visible', timeout: 5000 });
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(screenshotDir, 'service_modal.png') });

            // Close modal
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1000);
        }

        console.log('Taking screenshot of Blog section...');
        const blogSection = page.locator('#blog');
        await blogSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotDir, 'blog_section.png') });

    } catch (e) {
        console.error('Error during verification:', e);
        await page.screenshot({ path: path.join(screenshotDir, 'error_state.png') });
    } finally {
        console.log('Closing browser...');
        await browser.close();
        console.log('Verification script finished.');
    }
})();
