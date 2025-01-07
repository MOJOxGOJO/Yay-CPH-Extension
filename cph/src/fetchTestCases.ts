import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function fetchTestCases(url: string): Promise<void> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    });
    const page = await browser.newPage();

    // Set user agent to mimic a real browser
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait for test case sections to load
        await page.waitForSelector('pre', { timeout: 120000 });
        console.log('Test case section detected, scraping data...');

        // Extract test cases from the page
        const testCases = await page.evaluate(() => {
            const cases: { input: string; output: string }[] = [];
            const exampleSections = document.querySelectorAll('pre');

            exampleSections.forEach((section) => {
                const text = section.innerText.trim();
                if (text.includes('Input') && text.includes('Output')) {
                    const inputMatch = text.match(/Input:\s*([\s\S]*?)\nOutput:/);
                    const outputMatch = text.match(/Output:\s*([\s\S]*?)(\n|$)/);
                    if (inputMatch && outputMatch) {
                        cases.push({ input: inputMatch[1].trim(), output: outputMatch[1].trim() });
                    }
                }
            });

            return cases;
        });

        if (testCases.length === 0) {
            throw new Error('No test cases found on the page.');
        }

        // Save test cases to a directory
        const testCasesDir = path.join(__dirname, '..', 'test_cases');
        await fs.ensureDir(testCasesDir);

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const inputPath = path.join(testCasesDir, `input_${i + 1}.txt`);
            const outputPath = path.join(testCasesDir, `output_${i + 1}.txt`);

            await fs.writeFile(inputPath, testCase.input);
            await fs.writeFile(outputPath, testCase.output);

            console.log(`Saved test case ${i + 1} to ${inputPath} and ${outputPath}`);
        }
    } catch (error) {
        console.error('Error fetching test cases:', error);
        throw error;
    } finally {
        await browser.close();
    }
}
