import mongoose, { mongo } from "mongoose";

export const ticketModelo = mongoose.model(
    "ticket",
    new mongoose.Schema(
        {
            nroComprob:{ type: String, unique: true},
            fecha: Date,
            comprador: String,
            items: Array,
            total: Number
        },
        {
            timestamps: true, strict: false
        }
    )
)