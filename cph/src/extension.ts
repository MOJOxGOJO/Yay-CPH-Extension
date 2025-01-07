import * as vscode from 'vscode';
import { fetchTestCases } from './fetchTestCases';
import { runTestCases } from './runTestcases';

export function activate(context: vscode.ExtensionContext) {
    console.log('CPH Extension is now active!');
    
    let fetchTestCasesCommand = vscode.commands.registerCommand('cph.fetchTestCases', async () => {
        const url = await vscode.window.showInputBox({ prompt: 'Enter the LeetCode Problem URL' });
        if (url) {
            try {
                const testCases = await fetchTestCases(url);
                vscode.window.showInformationMessage('Test cases fetched successfully!');
            } catch (err) {
                vscode.window.showErrorMessage(`Error fetching test cases: ${err}`);
            }
        }
    });

    let runTestCasesCommand = vscode.commands.registerCommand('cph.runTestCases', async () => {
        try {
            await runTestCases();
            vscode.window.showInformationMessage('Test cases executed successfully!');
        } catch (err) {
            vscode.window.showErrorMessage(`Error running test cases: ${err}`);
        }
    });

    context.subscriptions.push(fetchTestCasesCommand, runTestCasesCommand);
}

export function deactivate() {}
