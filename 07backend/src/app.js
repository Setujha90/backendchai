import express from 'express';

const app=express();

app.use(cors({  //configure CORS to allow requests from origin
    origin:process.env.CORS_ORIGIN ,
    credentials: true
}))

app.use(express.json({limit:'16kb'})); // Middleware to parse JSON bodies,taking care of JSON data in requests

app.use(express.urlencoded({extended:true,limit:'16kb'})); // Middleware to parse URL-encoded bodies,taking care of form data in requests

app.use(express.static('public')); // Middleware to serve static files from the 'public' directory,store static assets like images,css,js files in the server

app.use(cookieParser());  //Allow server to set and read cookies from browser
export {app};