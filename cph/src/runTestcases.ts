import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);

export async function runTestCases() {
    const testCasesDir = path.join(__dirname, '..', 'test_cases'); // Adjusted path to locate test cases correctly
    const editor = vscode.window.activeTextEditor;

    // Check if a file is open in the editor
    if (!editor) {
        vscode.window.showErrorMessage('No code file is open in the editor. Please open a file and try again.');
        return;
    }

    const codeFile = editor.document.fileName; // Get the current file path
    const testCaseFiles = fs.readdirSync(testCasesDir).filter((file) => file.startsWith('input_'));

    if (testCaseFiles.length === 0) {
        vscode.window.showErrorMessage('No test cases found in the test_cases directory.');
        return;
    }

    for (const inputFile of testCaseFiles) {
        const caseNumber = inputFile.split('_')[1].split('.')[0];
        const inputFilePath = path.join(testCasesDir, inputFile);
        const outputFilePath = path.join(testCasesDir, `output_${caseNumber}.txt`);

        try {
            // Run the Python script with the input file redirected to stdin
            const { stdout, stderr } = await execPromise(`python3 ${codeFile} < ${inputFilePath}`);

            if (stderr) {
                vscode.window.showErrorMessage(`Error running test case ${caseNumber}: ${stderr}`);
            } else {
                const output = stdout.trim();
                const expectedOutput = fs.readFileSync(outputFilePath, 'utf-8').trim();

                if (output === expectedOutput) {
                    vscode.window.showInformationMessage(`Test case ${caseNumber} passed!`);
                } else {
                    vscode.window.showErrorMessage(
                        `Test case ${caseNumber} failed! Expected: ${expectedOutput}, Got: ${output}`
                    );
                }
            }
        } catch (err) {
            const error = err as Error; // Cast 'err' to 'Error' type
            vscode.window.showErrorMessage(`Error running test case ${caseNumber}: ${error.message}`);
        }
    }
}
