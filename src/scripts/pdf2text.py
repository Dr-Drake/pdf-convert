import sys
import os
from pdfminer.high_level import extract_text

# Get the filename of the input image from the command-line arguments
if len(sys.argv) < 2:
    print("Usage: python pdf2text.py <filePath>")
    sys.exit(1)

# Get path from argument
filePath = sys.argv[1]

file_name = os.path.basename(filePath)
file_name = os.path.splitext(file_name)[0]

# Extract text from the PDF file
text = extract_text(filePath)

# Save the text to a file
relative_path = './src/' + file_name + '.txt'
save_path = os.path.abspath(relative_path)

with open(save_path, 'w') as file:
    file.write(text)

# Print the file path
print(file.name)

