import * as vscode from 'vscode';

/**
 * Turn a domain into a sort key.
 * E.g. "mail.google.com" -> "com.google.mail"
 */
function sortKey(domain: string): string {
    const clean = domain.trim().toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .replace(/\.$/, '');
    return clean.split('.').reverse().join('.');
}

export function activate(context: vscode.ExtensionContext) {

    const ascending = vscode.commands.registerCommand('domainSort.ascending', () => {
        sortSelection(true);
    });

    const descending = vscode.commands.registerCommand('domainSort.descending', () => {
        sortSelection(false);
    });

    const extractHost = vscode.commands.registerCommand('domainSort.extractHost', () => {
        extractHostSelection();
    });

    context.subscriptions.push(ascending, descending, extractHost);
}

function sortSelection(asc: boolean) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No active editor.');
        return;
    }

    editor.edit(editBuilder => {
        editor.selections.forEach(sel => {
            const text = editor.document.getText(sel);
            if (!text.trim()) return;

            const lines = text.split(/\r?\n/);
            const sorted = [...lines].sort((a, b) => {
                const cmp = sortKey(a).localeCompare(sortKey(b));
                return asc ? cmp : -cmp;
            });
            editBuilder.replace(sel, sorted.join('\n'));
        });
    });
}

/**
 * From a selection of JSON lines, keep only the "host" field.
 * Non-JSON lines are passed through unchanged (e.g. subfinder INFO lines).
 */
function extractHostSelection() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No active editor.');
        return;
    }

    editor.edit(editBuilder => {
        editor.selections.forEach(sel => {
            const text = editor.document.getText(sel);
            if (!text.trim()) return;

            const lines = text.split(/\r?\n/);
            const output = lines.map(line => {
                const trimmed = line.trim();
                if (!trimmed) return line;
                try {
                    const obj = JSON.parse(trimmed);
                    if (obj && typeof obj.host === 'string') {
                        return obj.host;
                    }
                } catch {
                    // not JSON, pass through unchanged
                }
                return line;
            });

            editBuilder.replace(sel, output.join('\n'));
        });
    });
}

export function deactivate() {}