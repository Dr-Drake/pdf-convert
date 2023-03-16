import { spawn } from 'child_process';
import path from 'path';

export async function generateAsciiArt(base64Image: string): Promise<string> {

    let scriptPath = path.join(__dirname, '../scripts/drawAscii.py');
    return new Promise<string>((resolve, reject) => {
        const pythonProcess = spawn('python3', [scriptPath, base64Image]);

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
