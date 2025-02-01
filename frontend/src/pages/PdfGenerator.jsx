import { jsPDF } from "jspdf";
import headerImage from "../assets/lor_header.jpg";
import footerImage from "../assets/lor_footer.jpg";



export default function generatePdf(name_add, des, dept, camp, email, phone, content, name_sign) {
  const doc = new jsPDF();
  const lineSpacing = 5;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 25;
  const addStyledText = (doc, content, x, y, lineHeight = 10) => {
    if (typeof content === "string") {
      content = [content]; // Convert single string to array for uniform handling
    }

    if (Array.isArray(content)) {
      let currentY = y;

      content.forEach((line) => {
        const regex = /<b>(.*?)<\/b>/g;
        let lastIndex = 0;
        let match;

        // Split text based on <b> tags and style accordingly
        while ((match = regex.exec(line)) !== null) {
          // Add regular text before the bold text
          const regularText = line.substring(lastIndex, match.index);
          if (regularText) {
            doc.text(regularText, x, currentY, { maxWidth: pageWidth - 2 * margin, align: "justify" });
            x += doc.getTextWidth(regularText); // Adjust x position
          }

          // Add bold text
          doc.setFont("Helvetica", "bold");
          doc.text(match[1], x, currentY, { maxWidth: pageWidth - 2 * margin, align: "justify" });
          x += doc.getTextWidth(match[1]); // Adjust x position
          doc.setFont("Helvetica", "normal");

          lastIndex = regex.lastIndex;
        }

        // Add remaining regular text after the last <b> tag
        const remainingText = line.substring(lastIndex);
        if (remainingText) {
          doc.text(remainingText, x, currentY, { maxWidth: pageWidth - 2 * margin, align: "justify" });
        }

        x = 10; // Reset x for the next line
        currentY += lineHeight; // Move to the next line
      });
    } else {
      doc.text("Invalid content format.", x, y);
    }
  };
    
    // Add Header Image
    doc.addImage(headerImage, 'JPG', 0, 0, pageWidth, 50); // Adjust position and size
    doc.addImage(footerImage, 'JPG', 0, pageHeight - 15, pageWidth, 15);

    // Faculty Details
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    let currentY = 65;

    doc.text(`${name_add}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(`${des}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(`${dept}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(
      `GITAM(Deemed to be University), ${camp} Campus`,
      25,
      currentY
    );
    currentY += lineSpacing;
    doc.text(`Email: ${email}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(`Phone:+91 ${phone}`, 25, currentY);
    currentY += lineSpacing;

    // Heading
    currentY += lineSpacing + 10;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    const headingText = "LETTER OF RECOMMENDATION";
    doc.text(headingText, pageWidth / 2, currentY, {
      align: "center",
    });

    // Underline
    const textWidth = doc.getTextWidth(headingText); // Get the width of the heading text
    const startX = (pageWidth - textWidth) / 2; // Calculate the starting X position
    doc.setLineWidth(0.5); // Set line thickness
    doc.line(startX, currentY + 1, startX + textWidth, currentY + 1); // Draw the line

    // Content
    currentY += lineSpacing + 5;
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    addStyledText(doc, content, 25, currentY);

    // Signature area
    currentY = doc.internal.pageSize.height - 60;
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text("With regards,", 25, currentY);
    currentY += lineSpacing + 3;
    doc.setFont("times", "bold");
    doc.text(
      `${name_sign}`,
      25,
      doc.internal.pageSize.height - 37
    );

    return doc;
}