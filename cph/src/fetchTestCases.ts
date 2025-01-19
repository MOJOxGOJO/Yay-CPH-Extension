import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function fetchTestCases(url: string): Promise<void> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    });
    const page = await browser.newPage();

    // Set custom user agent
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    try {
        // Navigate to the URL and wait until content is fully loaded
        await page.goto(url, { waitUntil: 'networkidle0'});

        // Extract the raw test case data from <pre> tags
        const testData = await page.evaluate(() => {
            let preElements = document.querySelectorAll('div.elfjS pre');
            if (preElements.length === 0) {
                preElements = document.querySelectorAll('div.example-block');
            }
            console.log(preElements);
            return Array.from(preElements).map((el) => el.textContent?.trim());
        });

        if (testData.length === 0) {
            throw new Error('No test case data found on the page.');
        }

        const testCasesDir = path.join(__dirname, '..', 'test_cases');
        await fs.ensureDir(testCasesDir);

        // Helper function to recursively format array data into a space-separated string
        const formatArray = (arr: Array<any>): string => {
            return arr.reduce((acc, item) => {
                if (Array.isArray(item)) {
                    return acc + formatArray(item); // Recursively format nested arrays
                }
                return acc + `${item} `;
            }, `${arr.length} `).trim();
        };

        // Process each extracted test case data
        testData.forEach((data: any, idx) => {
            let pointer = 0;
            let inputData = "";
            let outputData = "";

            // Separate input and output by splitting at the first empty line
            while (inputData.length === 0) {
                while (data[pointer] !== '\n' && pointer < data.length) {
                    inputData += data[pointer];
                    pointer++;
                }
                pointer++; // Skip newline character
            }

            while (outputData.length === 0) {
                while (data[pointer] !== '\n' && pointer < data.length) {
                    outputData += data[pointer];
                    pointer++;
                }
                pointer++; // Skip newline character
            }

            // Format the input section
            let formattedInput = '';
            let inputPointer = 0;
            while (inputPointer < inputData.length) {
                if (inputData[inputPointer] === '=') {
                    inputPointer += 2; // Skip "= "
                    let segment = '';
                    while (
                        inputPointer < inputData.length &&
                        inputData[inputPointer] !== ' ' &&
                        inputData[inputPointer] !== '\n'
                    ) {
                        segment += inputData[inputPointer];
                        inputPointer++;
                    }

                    if (segment.endsWith(',')) {
                        segment = segment.slice(0, -1); // Remove trailing comma
                    }

                    // Ensure identifiers are quoted for valid JSON parsing
                    const parsedInput = JSON.parse(segment);

                    // Process parsed input (whether it's an array or a single value)
                    formattedInput += Array.isArray(parsedInput)
                        ? formatArray(parsedInput)
                        : `${parsedInput} `;

                    // Remove any trailing space before adding line break
                    formattedInput = formattedInput.trim() + '\r\n';
                }
                inputPointer++;
            }

            // Format the output section
            let formattedOutput = '';
            let outputRaw = outputData.slice(8); // Skip the "Output: "
            const parsedOutput = JSON.parse(outputRaw);

            formattedOutput += Array.isArray(parsedOutput) ? formatArray(parsedOutput) : `${parsedOutput} `;
            formattedOutput = formattedOutput.trim() + '\r\n';

            // Save the formatted input/output data to separate files
            const inputFilePath = path.join(testCasesDir, `input_${idx + 1}.txt`);
            const outputFilePath = path.join(testCasesDir, `output_${idx + 1}.txt`);

            fs.writeFileSync(inputFilePath, formattedInput);
            fs.writeFileSync(outputFilePath, formattedOutput);

            console.log(`Test case ${idx + 1} saved at: ${inputFilePath} and ${outputFilePath}`);
        });

    } catch (err) {
        console.error('Error while processing test cases:', err);
        throw err;
    } finally {
        await browser.close();
    }
}
