import Joi from "joi";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const sessionSchema = new Schema(
    {
        uid: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    }, 
    { versionKey: false, timestamps: true });

const Session = model("session", sessionSchema);
export { Session };

