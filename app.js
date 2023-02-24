const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app  =  express();
const cors = require('cors');
app.use(cors({ origin: '*'}));

const fileupload  =  require('express-fileupload');
var fs = require('fs');
app.use(fileupload());
app.use(express.json({ limit: "200mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "200mb",
  })
);


app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "public")));

app.post('/upload',(req, res)=>{
    let uploadPath = path.join(__dirname, "public/upload/");
    let unique =  uuidv4();
 
    let filePathPromise = new Promise(function(resolve, reject) {
  
    if(req.files.filename.length > 0){
            //USE FORLOOP
            let array = [];
            req.files.filename.forEach(function(files){
              
              console.log('req.files::::::::::::::',files.name)
              let upload_path = uploadPath + unique + files.name;
              fs.writeFile(upload_path, files.data, function(err) {
                if(err) {
                    return console.log(err);
                }

                
            let obj = {
                  filepath: upload_path, 
                  filename: unique + files.name
             }
             array.push(obj);
              console.log(array,"multiples files array");
            }); 
            return resolve(array)
          })
           
        }else{
          let upload_path = uploadPath + unique + req.files.filename.name;
          fs.writeFile(upload_path, req.files.filename.data, function(err) {
            if(err) {
                return console.log(err);
            }
            let obj = {
              filepath: upload_path, 
              filename: unique + req.files.filename.name
            }
            return resolve(obj)
        }); 
      }
    });

  filePathPromise.then(result=>{
    console.log(result,"result");
      res.json({status:200, files:result})
  })
})




app.listen(5000, function(){
    console.log('RUNING ON PORT 5000')
})
