const app = require("./app")

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send({
        activeStatus:true,
        error:false,
    })
})


app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`)
})