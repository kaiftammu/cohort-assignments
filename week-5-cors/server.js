import express from "express";
import cors from "cors";


const app = express();
const PORT= process.env.PORT||3000;

app.use(express.json());
app.use(cors());

app.post("/sum",(req,res)=> {
    const{ a, b }= req.body;

    if ( isNaN(a) || isNaN(b) ){
        return res.status(400).json({Error: "please send numbers a and b in JSON body"});
        
    }
    const result = Number(a) + Number(b);
    res.json({ sum: result });
});

app.listen(PORT, () => {
    console.log("server running on http://localhost:3000");
    
});

