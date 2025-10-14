import saveAs from 'file-saver';

export const generateDoc = (element: HTMLElement, fileName: string = 'curriculo.doc'): void => {
    if (!element || !element.firstElementChild) {
        console.error("Resume preview element not found for DOC generation.");
        return;
    }

    // Get the outerHTML of the actual resume template, which includes all inline styles
    const resumeContent = element.firstElementChild.outerHTML;

    const htmlString = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Currículo</title>
            </head>
            <body>
                ${resumeContent}
            </body>
        </html>
    `;

    const blob = new Blob([htmlString], { type: 'application/msword' });
    saveAs(blob, fileName);
};