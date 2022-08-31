import dotenv from "dotenv"
dotenv.config()
import express from "express";
import jwt from "jsonwebtoken";
const PRIVATE_KEY ="mi_token_secreto";
const app = express();

app.use(express.json())

app.get('/', function (req,res){
    res.send('Hello world')
})

app.get("/api/protected", auth, (req,res)=>{
    res.send("Estoy en /protected")
});

app.post("/api/login", (req,res)=>{
    const {username,password,direccion}= req.body;
    //login
    const userForToken={
        username,
        direccion
    };

    const token= jwt.sign(userForToken, PRIVATE_KEY);
    res.json({
        token,
    });
});

function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: "not authenticated",
      });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, "mi_token_secreto", (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "not authorized",
        });
      }
      req.user = decoded.data;
      next();
    });
  }

  const PORT = process.env.PORT || 8080;
  

app.listen(PORT, ()=>{
  console.log(`Server on ${PORT}`)
})