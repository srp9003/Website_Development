/**
 * @fileoverview This file sets up a basic Express.js web server that allows users to submit blog posts and view them.
 * It uses EJS for rendering views and body-parser for handling form submissions.
 * The server listens on port 3000.
 * It is very important to understand that there are no Databases being used here.
 * As soon as the server is terminated or refreshed all the data related to the Blogs will be lost.
 */  
    import express from "express";                  
    import bodyParser from "body-parser";           
    import ejs from "ejs";                          
    import path from "path";
    import { fileURLToPath } from "url";


//Port number where the Server listens to requests
    const port = 3000;                            
    
//Express app initialization
    const app = express()   
    
//Get the directory name for the current file 
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
//Variable initialization for storing Blog data and tracking specific Blogs  
    var blogs_list = [];                            
    var selected_blog = {};            
    
//Middleware to server static files from the "public" folder
    app.use(express.static('public'));              

//Middleware to parsing URL-encoded and JSON data
    app.use(bodyParser.urlencoded({ extended : true}));     
    app.use(bodyParser.json());                             


/**
 * Route for the Homepage ("/")
 * Renders the "index.ejs" view with the list of blogs.
 * @param {Object} req - The request object.
 * @param {Object} req - The response object. 
 */
    app.get("/", (req, res) => {
        res.render("index.ejs",{blogs_list});
    })

/**
 * Route to handle blog submissions via POST ("/submit")
 * Receives the data from the form and adds a new blog to the blogs_list
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
    app.post("/submit", (req, res) => {
        const data = req.body;
        const push_data = {
            Title : data['Title'], 
            Author : data['Author'], 
            Content : data['Content']};

//Add the new Blog to the list.
        blogs_list.push(push_data);
//Redirect to the Homepage to render the blogs. 
        res.redirect("/")    
        });

/**
 * Route to handle selecting a specific blog via POST("/blog_data").
 * Stores the selected blog's data in the "selected_blog" variable.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.  
 */
    app.post("/blog_data" ,(req, res) => {
//Store the selected blog's data
    selected_blog = req.body;
//Redirect to the individual blog page
    res.redirect("/blogs");
    })

/**
 * Route to display the selected blog ("/blogs").
 * Searches through the blogs_list to find the matching blog and render it.
 * The content of the Blog is split by line breaks for better presentation.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
    app.get("/blogs", (req, res) => {

//Search for the blog matching the selected blog's title and author
        for(var i=0; i<blogs_list.length; i++){
            if(blogs_list[i]['Title'] === selected_blog['Title'] && blogs_list[i]['Author'] === selected_blog['Author']){
                const data = blogs_list[i];
                const data_set = {
                    Title: data.Title, 
                    Author: data.Author,
                    //split the content by line breaks
                    Content: data.Content.split("\r\n")}
                //Render the blog page with data
                res.render("blogs.ejs", {data_set});
                break;
            }
        }
    })

/**
 * Starts the Express server and listens on the specified port.
 * Logs a message to the console once the server is running.
 */

    app.listen(port, () => {
        console.log(`Listening at ${port}`);
    })
