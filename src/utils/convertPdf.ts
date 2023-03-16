import { spawn } from 'child_process';
import path from 'path';
import { ConversionType } from '../types/ConversionType';

function fetchScript(type: ConversionType) {
    switch (type) {
        case ConversionType.TEXT:
            return path.join(__dirname, '../scripts/pdf2text.py')
    
        case ConversionType.DOCX:
            return path.join(__dirname, '../scripts/pdf2doc.py')
            
    }
}

export async function convertPdf(filePath: string, type: ConversionType = ConversionType.TEXT): Promise<string> {

    let scriptPath = fetchScript(type);
    console.log(scriptPath);
    console.log(filePath);

    return new Promise<string>((resolve, reject) => {
        const pythonProcess = spawn('python3', [scriptPath, filePath]);

        let output = '';

        pythonProcess.stdout.on('data', (data: Buffer) => {
            // console.log(data.toString())
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data: Buffer) => {
            console.error(`Error: ${data}`);
            reject();
        });

        pythonProcess.on('close', (code: number) => {
            if (code !== 0) {
                console.error(`Process exited with code ${code}`);
                reject();
            } else {
                resolve(output);
            }
        });
    });
}
