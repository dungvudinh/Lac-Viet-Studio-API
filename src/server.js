import express from 'express'

const app = express()
const hostName = 'localhost'
const port = 8017

app.get('/', (req,res)=>{
    res.send('HELLO WORLD')
})

app.listen(port, hostName, ()=> console.log(`server is running on port ${port}`))