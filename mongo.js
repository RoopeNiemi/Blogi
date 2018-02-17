const mongoose=require('mongoose')
const User=require('./models/user')

require ('dotenv').config()
const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise=global.Promise






  if(process.argv.length>2){
    const user = new User({
        username: process.argv[2],
        name: process.argv[3],
        password:process.argv[4],
        adult:true
      })

      user
  .save()
  .then(result=>{
      mongoose.connection.close()
  })}
    else{
        User
        .find({})
        .then(result => {
        result.forEach(user => {
            console.log(user.name+''+user.username+' ,adult: '+user.adult)
        })
        mongoose.connection.close()
  })
}