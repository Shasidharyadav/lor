import { jsPDF } from "jspdf";
import headerImage from "../assets/lor_header.jpg";
import footerImage from "../assets/lor_footer.jpg";



export default function generatePdf(name_add, des, dept, camp, email, phone, content, name_sign) {
  const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 25;
      const pageHeight = doc.internal.pageSize.height;
  
      // Header and Footer
      doc.addImage(headerImage, "JPG", 0, 0, pageWidth, 50); 
      doc.addImage(footerImage, "JPG", 0, pageHeight - 15, pageWidth, 15); 
  
      // Faculty (Teacher) Details
      doc.setFontSize(12);
      doc.setFont("times", "bold");
      let currentY = 65;
      const lineSpacing = 5;
  
      doc.text(`${name_add}`, margin, currentY);
      currentY += lineSpacing;
      doc.text(`${des}`, margin, currentY);
      currentY += lineSpacing;
      doc.text(`${dept}`, margin, currentY);
      currentY += lineSpacing;
      doc.text(
        `GITAM(Deemed to be University), ${camp} Campus`,
        margin,
        currentY
      );
      currentY += lineSpacing;
      doc.text(`Email: ${email}`, margin, currentY);
      currentY += lineSpacing;
      doc.text(`Phone: +91 ${phone}`, margin, currentY);
      currentY += lineSpacing;
  
      // Heading
      currentY += lineSpacing + 10;
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("LETTER OF RECOMMENDATION", pageWidth / 2, currentY, {
        align: "center",
      });
  
      // Content
      currentY += lineSpacing + 5;
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text(content, margin, currentY, {
        maxWidth: pageWidth - 2 * margin,
        align: "justify",
      });
  
      // Signature area
      currentY = doc.internal.pageSize.height - 60;
      doc.setFontSize(12);
      doc.setFont("times", "normal");
      doc.text("With regards,", margin, currentY);
      currentY += lineSpacing + 3;
      doc.setFont("times", "bold");
      doc.text(
        `${name_sign}`,
        margin,
        doc.internal.pageSize.height - 37
      );
  
      return doc;
};