import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';

export async function runTestCases(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
        vscode.window.showErrorMessage('Please open a file to execute the test cases.');
        return;
    }

    const doc = activeEditor.document;
    const filePath = doc.fileName;
    const fileExt = path.extname(filePath);

    // Validate supported file types
    if (!['.cpp', '.py'].includes(fileExt)) {
        vscode.window.showErrorMessage('Supported file types are C++ (.cpp) and Python (.py) only.');
        return;
    }

    // Directory containing test case files
    const testCasesPath = path.join(__dirname, '..', 'test_cases');
    if (!(await fs.pathExists(testCasesPath))) {
        vscode.window.showErrorMessage(`The directory containing test cases was not found: ${testCasesPath}`);
        return;
    }

    // Retrieve input and output test case files
    const inputFiles = (await fs.readdir(testCasesPath))
        .filter((filename) => filename.startsWith('input_') && filename.endsWith('.txt'))
        .sort();

    const expectedOutputFiles = (await fs.readdir(testCasesPath))
        .filter((filename) => filename.startsWith('output_') && filename.endsWith('.txt'))
        .sort();

    // Validate test case availability
    if (inputFiles.length === 0 || expectedOutputFiles.length === 0) {
        vscode.window.showErrorMessage('No test case files found.');
        return;
    }

    if (inputFiles.length !== expectedOutputFiles.length) {
        vscode.window.showErrorMessage('The number of input files does not match the number of output files.');
        return;
    }

    try {
        const testResults: string[] = [];
        for (let idx = 0; idx < inputFiles.length; idx++) {
            const inputFilePath = path.join(testCasesPath, inputFiles[idx]);
            const outputFilePath = path.join(testCasesPath, expectedOutputFiles[idx]);
            const expectedOutput = (await fs.readFile(outputFilePath, 'utf-8')).trim();

            let executionCommand = '';
            if (fileExt === '.cpp') {
                executionCommand = `g++ -o /tmp/solution ${filePath} && /tmp/solution < ${inputFilePath}`;
            } else if (fileExt === '.py') {
                executionCommand = `python3 ${filePath} < ${inputFilePath}`;
            }

            const actualOutput = await executeShellCommand(executionCommand);

            if (actualOutput.trim() === expectedOutput) {
                testResults.push(`Test case ${idx + 1}: Passed ✅`);
            } else {
                testResults.push(
                    `Test case ${idx + 1}: Failed ❌\nExpected: ${expectedOutput}\nActual: ${actualOutput.trim()}`
                );
            }
        }

        vscode.window.showInformationMessage('Test cases executed successfully. Review the results in the console.');
        testResults.forEach((result) => console.log(result));
    } catch (error) {
        vscode.window.showErrorMessage(`An error occurred during execution: ${error}`);
    }
}

// Function to execute shell commands
async function executeShellCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(stderr || err.message);
            } else {
                resolve(stdout);
            }
        });
    });
}
