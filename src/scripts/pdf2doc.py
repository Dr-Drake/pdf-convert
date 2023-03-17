import sys
import os
from pdf2docx import Converter

# Get the filename of the input file from the command-line arguments
if len(sys.argv) < 2:
    print("Usage: python pdf2doc.py <filePath>")
    sys.exit(1)

# Get path from argument
filePath = sys.argv[1]

# Get file name
file_name = os.path.basename(filePath)
file_name = os.path.splitext(file_name)[0]

# Save the text to a file
relative_path = './src/' + file_name + '.docx'
save_path = os.path.abspath(relative_path)

# convert to word docx
pdfConverter = Converter(filePath)
pdfConverter.convert(save_path)

# Print the file path
print(save_path)