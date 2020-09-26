// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function extractVariableWords(rawVariableText : string): Array<string> | null { //RegEx = /[A-Z]+[a-z1-9]*|[A-Z]*[a-z1-9]+/g
	return rawVariableText.match(/[A-Z]+[a-z1-9]*|[A-Z]*[a-z1-9]+/g);
}

function toTitleCase(text : string) : string {
	return text.replace(/(^.)(.*)/, (_match: string, first : string, remainder : string) => first.toUpperCase() + remainder.toLowerCase());
};

type CaseStyles = "camelCase" | "PascalCase" | "snake_case" | "SCREAMING_SNAKE_CASE" | "train-case" | "SCREAMING-TRAIN-CASE" | "cRaZyCaSe";
function convertToCaseStyle(style : CaseStyles, highlightedText : string) : string {
	let variableWords : Array<string> | null = extractVariableWords(highlightedText);
	if(!variableWords){
		throw Error("No Matches in Selection");
	}

	let outputVariable : string;
	switch(style) {
		case "camelCase":
			// Array Concat vs String Concat
			outputVariable = variableWords[0].toLowerCase() + variableWords.splice(1).map((variableWord : string) => toTitleCase(variableWord)).join('');
			break;
		case "PascalCase":
			outputVariable = variableWords.map((variableWord : string) => toTitleCase(variableWord)).join('');
			break;
		case "snake_case":
			outputVariable = variableWords.map((variableWord : string) => variableWord.toLowerCase()).join('_');
			break;
		case "SCREAMING_SNAKE_CASE":
			outputVariable = variableWords.map((variableWord : string) => variableWord.toUpperCase()).join('_');
			break;
		case "train-case":
			outputVariable = variableWords.map((variableWord : string) => variableWord.toLowerCase()).join('-');
			break;
		case "SCREAMING-TRAIN-CASE":
			outputVariable = variableWords.map((variableWord : string) => variableWord.toUpperCase()).join('-');
			break;
		case "cRaZyCaSe":
			outputVariable = variableWords.map((variableWord : string) => [...variableWord.toLowerCase()].map((char: string) => {
				if (Math.random() < 0.5) {
					char = char.toUpperCase();
				}
				return char;
			}).join('')).join(' ');
			break;
		default:
			throw Error("Style is not listed");
	}
	return outputVariable;
}

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "casechanger" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let styles : Array<CaseStyles> = ['camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE', 'train-case', 'SCREAMING-TRAIN-CASE', 'cRaZyCaSe'];
	
	styles.forEach((style : CaseStyles) => {
		context.subscriptions.push(vscode.commands.registerCommand(`casechanger.${style}`, function () {
			if (!vscode.window.activeTextEditor) {
				return;
			}

			console.log(JSON.stringify(vscode.window.activeTextEditor.selection));

			vscode.window.activeTextEditor.edit((editBuilder) => {
				if (!vscode.window.activeTextEditor) {
					return;
				}
				let replacing: string = convertToCaseStyle(style, vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection));
				console.log(style + ': ' + replacing);
				editBuilder.replace(vscode.window.activeTextEditor.selection, replacing);
			});
		}));

	});
}

// this method is called when your extension is deactivated
export function deactivate() {}