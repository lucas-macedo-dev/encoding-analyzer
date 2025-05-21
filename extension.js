const vscode = require('vscode');
const jschardet = require('jschardet');

function activate(context) {
	let disposable = vscode.workspace.onDidOpenTextDocument(document => {
		const text = document.getText();
		const encoding = jschardet.detect(text);

		const expectedEncoding = vscode.workspace.getConfiguration('encodingAnalyzer').get('expectedEncoding');
		const ignoreBinary = vscode.workspace.getConfiguration('encodingAnalyzer').get('ignoreBinaryFiles');

		if (ignoreBinary && isBinary(text)) return;

		if (encoding && encoding.encoding.toLowerCase() !== expectedEncoding.toLowerCase()) {
			vscode.window.showWarningMessage(
				`Parece que esse arquivo está com um encoding diferente do esperado.
				\n Encoding detectado: "${encoding.encoding}".`,
				'Reabrir com outro encoding'
			).then(selection => {
				if (selection === 'Reabrir com outro encoding') {
					vscode.commands.executeCommand('workbench.action.editor.changeEncoding');
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

function isBinary(text) {
	// Se houver muitos caracteres nulos ou não imprimíveis, é binário
	const threshold = 0.3;
	const nonPrintable = text.split('').filter(char => {
		const code = char.charCodeAt(0);
		return (code < 9 || (code > 13 && code < 32) || code === 65533);
	}).length;

	return (nonPrintable / text.length) > threshold;
}

function deactivate() {
	console.log('Congratulations, your extension "encoding-analyzer" is now deactivated!');
}

module.exports = {
	activate,
	deactivate
};
