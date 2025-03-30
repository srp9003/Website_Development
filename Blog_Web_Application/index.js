    import express from "express";
    import bodyParser from "body-parser";
    import ejs from "ejs";
    import path from "path";
    import { fileURLToPath } from "url";

    const port = 3000;
    const app = express()
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    var blogs_list = [];
    var selected_blog = {};

    app.use(express.static('public'));

    app.use(bodyParser.urlencoded({ extended : true}));
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
        res.render("index.ejs",{blogs_list});
    })

    app.post("/submit", (req, res) => {
        const data = req.body;
        const push_data = {Title : data['Title'], Author : data['Author'], Content : data['Content']};
        blogs_list.push(push_data); 
        res.redirect("/")    
        });

    app.post("/blog_data" ,(req, res) => {
    selected_blog = req.body;
    res.redirect("/blogs");
    })

    app.get("/blogs", (req, res) => {
        for(var i=0; i<blogs_list.length; i++){
            if(blogs_list[i]['Title'] === selected_blog['Title'] && blogs_list[i]['Author'] === selected_blog['Author']){
                const data = blogs_list[i];
                const data_set = {Title: data.Title, Author: data.Author, Content: data.Content.split("\r\n")}
                res.render("blogs.ejs", {data_set});
                break;
            }
        }
    })

    /*
    When the files to be sent are located under different folder than Public this method is supposed to be used
    //app.get("/Blog",(req, res) => {
    //    res.sendFile(path.join(__dirname,"Views", "/Blog.html"))
    }) */

    app.listen(port, () => {
        console.log(`Listening at ${port}`);
    })
