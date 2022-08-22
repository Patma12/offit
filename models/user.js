const mongoose = require('mongoose');
const Activity = require('./activity');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
       
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    height: {
        type: Number,
        required: true,
        min: 0
    },
    // profileImg: {
    //     type: String,
    //     required: true
    // },
    bmi: {
        type: Number,
        
    }
})

// DELETE ALL ASSOCIATED PRODUCTS AFTER A USER IS DELETED
// userSchema.post('findOneAndDelete', async function (user) {
//     if (user.products.length) {
//         const res = await Product.deleteMany({ _id: { $in: user.products } })
//         console.log(res);
//     }
// })


const User = mongoose.model('User', userSchema);

module.exports = User;
