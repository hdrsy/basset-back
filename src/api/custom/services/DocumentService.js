const { Docx } = require('docx');

module.exports = {
  generateDocx: async (content) => {
    // Create a new document
    const document = new Docx.Document();
    const paragraph = new Docx.Paragraph('Hello, World!');
    document.addParagraph(paragraph);

// Generate the docx file
    const packer = new Docx.Packer();
    packer.toBuffer(document).then((buffer) => {
    // Do something with the buffer, such as save it to a file or send it as a response
        return buffer;
    });
    
  },
};