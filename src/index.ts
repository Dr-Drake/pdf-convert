import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { generateAsciiArt } from './utils/generateAsciiArt';
import bodyParser from 'body-parser';
import multer from 'multer';
import { removeFile } from './utils/removeFile';
import { ConversionType } from './types/ConversionType';
import { convertPdf } from './utils/convertPdf';

/** PORT */
const PORT = process.env.PORT || 3000;

/** Multer */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Set the file name to the original name
    }
});
const upload = multer({ storage });

/**
 * Create http and socket.io server
 */
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    }
});

/**
 * Middlewares
 */

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname +'/views');

// Serve static directory
app.use(express.static(path.join(__dirname, '../public')))

/**
 * Socket events and handlers
 */

// Listen for incoming connections
io.on('connection', (socket) => {
    console.log('Client connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
    });
});


/**
 * Routes
 */
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Handle image uploads
app.post('/convert', upload.single('file'), async (req, res) => {

    // If no file, bad request
    if (!req.file) {
        res.status(400).json({
            message: "No file sent"
        })
    }
    else{

        // Get the type of conversion
        let type: ConversionType = req.query.type as ConversionType;

        try {
            // Call the Python script to process the image
            let filePath = req.file.path;
            const savedPath = await convertPdf(filePath, type);

            /**
             * Once art generated, remove the file
             */
            if (savedPath) {
                removeFile(filePath);
            }
            console.log("PATH: ", savedPath.slice(0, -1));
            
            // Return the file as a download
            res.sendFile(savedPath.slice(0, -1), (err)=>{
                if (err) {
                    console.log(err);
                    res.status(404).json({
                        message: "Processed file not found"
                    })
                }
                removeFile(savedPath.slice(0, -1));
            })

            /** Remove the savedFile */
            // removeFile(savedPath);
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "An unknown error occured"
            })
        }
    }
});

/**
 * Listen on PORT
 */
server.listen(PORT, () => {
    console.log('listening on ', PORT);
});
