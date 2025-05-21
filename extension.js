const vscode = require('vscode');
const jschardet = require('jschardet');
const fs = require('fs');
const path = require('path');

// Arquivos já verificados
const checkedFiles = new Set();

function normalizeEncoding(enc) {
	if (!enc) return '';
	const e = enc.toLowerCase().replace(/[_\-]/g, '');
	if (['utf8', 'utf'].includes(e)) return 'utf-8';
	if (e === 'ascii') return 'utf-8'; // ASCII é subconjunto de UTF-8
	return enc.toLowerCase();
}

function isBinary(buffer) {
	// Procura por bytes nulos
	const textSample = buffer.slice(0, 1000);
	return textSample.includes(0);
}

function shouldIgnoreFile(filePath) {
	const ignoredExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.exe', '.dll', '.zip', '.tar', '.gz'];
	const ignoredDirs = ['.git', 'node_modules', '.vscode'];

	const ext = path.extname(filePath).toLowerCase();
	if (ignoredExtensions.includes(ext)) return true;

	for (const part of filePath.split(path.sep)) {
		if (ignoredDirs.includes(part)) return true;
	}
	return false;
}

function activate(context) {
	let disposable = vscode.workspace.onDidOpenTextDocument(document => {

		const filePath = document.uri.fsPath;
		if (!filePath || document.uri.scheme !== 'file') return;
		if (checkedFiles.has(filePath)) return;
		if (shouldIgnoreFile(filePath)) return;

		const config = vscode.workspace.getConfiguration('encodingAnalyzer');
		const expectedRaw = config.get('expectedEncoding') || 'utf-8';
		const ignoreBinary = config.get('ignoreBinaryFiles') ?? true;
		
		const expected = normalizeEncoding(expectedRaw);

		try {
			const buffer = fs.readFileSync(filePath);
			if (ignoreBinary && isBinary(buffer)) return;

			const detected = jschardet.detect(buffer, { minimumThreshold: 0.9 });
			const detectedNorm = normalizeEncoding(detected.encoding);
			
			// console.log(`[EncodingAnalyzer] ${filePath}`);
			// console.log(`  ↳ Detectado: ${detected.encoding}`);
			// console.log(`  ↳ Esperado:  ${expected}`);

			if (detectedNorm && detectedNorm !== expected) {
				vscode.window.showWarningMessage(
					`Parece que esse arquivo está com um encoding diferente do esperado.
				\n Encoding detectado: "${detectedNorm}".`,
					'Reabrir com outro encoding'
				).then(selection => {
					if (selection === 'Reabrir com outro encoding') {
						vscode.commands.executeCommand('workbench.action.editor.changeEncoding');
					}
				});
			}
		} catch (err) {
			console.error('Erro ao ler o arquivo:', err);
		} finally {
			// TODO melhorar cache
			// checkedFiles.add(filePath);
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() {
	console.log('Tun dum dum dum (barulho do windows)');
}

module.exports = {
	activate,
	deactivate
};
