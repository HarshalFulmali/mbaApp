if(process.env.NODE_ENV != 'productions') {
    require('dotenv').config();
}
module.exports={
    PORT:process.env.PORT
}