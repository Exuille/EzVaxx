import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    manufacturer: { 
        type: String, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    expirationDate: { 
        type: Date, 
        required: true 
    },    
}, { timestamps: true });

const Vaccine = mongoose.model("Vaccine", vaccineSchema);
export default Vaccine;


