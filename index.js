require('dotenv').config();

const app = require('./api/app');
const PORT = process.env.PORT || 8080

const start = async () => {
    try{
        app.listen(PORT, () => {
            console.log(`Server has been started on ${PORT}`)
        })
    }catch(e){
        console.log(e)
    }
}
start()