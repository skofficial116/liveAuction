import mongoose from "mongoose";

// const attributeTypeSchema = new mongoose.Schema({
//   typeOf: {
//     type: String,
//     enum: ["string", "int", "select"],
//     default: "string",
//   }
// });

const attributeSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  name: { type: String },
  description: { type: String },
  typeOf: {
    type: String,
    enum: ["string", "int", "select"],
    default: "string",
  },
  // type: attributeTypeSchema,

  default: { type: mongoose.Schema.Types.Mixed },
  options: [{ type: String, default: null }],
});

attributeSchema.index({ auction: 1, name: 1 }, { unique: true });
 
export default mongoose.model("Attribute", attributeSchema);
