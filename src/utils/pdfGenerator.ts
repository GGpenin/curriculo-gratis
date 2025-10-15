import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePdf = async (wrapperElement: HTMLElement): Promise<void> => {
    // The actual resume content is the first child of the wrapper, which is styled to A4 dimensions.
    const elementToCapture = wrapperElement.firstElementChild as HTMLElement;

    if (!elementToCapture) {
        console.error("Resume template element not found for PDF generation.");
        return;
    }

    // A function to ensure fonts and images are loaded before capture
    const waitForAssets = async () => {
        const promises = Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }));
        
        if (document.fonts) {
            await document.fonts.ready;
        }

        return Promise.all(promises);
    };

    await waitForAssets();
    
    // Temporarily reset transform on the wrapper for an accurate, full-scale capture of the child
    const originalTransform = wrapperElement.style.transform;
    wrapperElement.style.transform = '';

    const canvas = await html2canvas(elementToCapture, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: null // Use element's background color
    });
    
    // Restore original transform on the wrapper after capture
    wrapperElement.style.transform = originalTransform;

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;

    // Calculate the dimensions of the image in the PDF to maintain aspect ratio
    let imgWidth = pdfWidth;
    let imgHeight = pdfWidth / canvasAspectRatio;

    // If the calculated height is greater than the PDF height,
    // it means the image is taller than the page, so we fit to height instead.
    if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * canvasAspectRatio;
    }
    
    // Center the image on the page (optional, but looks better if there are slight mismatches)
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    pdf.save('curriculo.pdf');
};
