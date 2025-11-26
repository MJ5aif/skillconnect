import http from 'http'
import fs from 'fs/promises';
import url from 'url';
import path from 'path'
const PORT = process.env.PORT;

//get current path
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log(__filename,__dirname);

const server = http.createServer(async(req,res) => {
    try {
        let filename;
        if(req.method === 'GET'){
            if(req.url === '/'){
                filename = path.join(__dirname,'public','index.html');
            }
            else if(req.url === '/About'){
                filename = path.join(__dirname,'public','about.html');
            }
            else{
                throw new Error("NOT FOUND");
            }

            const data = await fs.readFile(filename);
            res.setHeader('Content-Type','text/html');
            res.write(data);
            res.end();
        }
        else{
            throw new Error("Method not allowed");
        } 
    } catch (error) {
        res.writeHead(500,{'content-type' : 'plain/text'});
        res.end("Server Error");
    }
})

server.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`);
})