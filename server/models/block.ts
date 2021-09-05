import { Document, model, Schema } from "mongoose";

export interface IBlock extends Document {
  publicId: number;
  nbFiles: number;
  totalSize: number;
  isPinnedToCrust: boolean;
  createdDate: Date;
  pinnedDate: Date;
  cid: string;
}

// Setup schema
const schema = new Schema<IBlock>({
  publicId: {
    type: Number,
    default: 0,
    required: true,
  },
  nbFiles: {
    type: Number,
    default: 0,
    required: false,
  },
  totalSize: {
    type: Number,
    default: 0,
    required: false,
  },
  isPinnedToCrust: {
    type: Boolean,
    default: false,
  },
  cid: {
    type: String,
    default: null,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
  pinnedDate: {
    type: Date,
    default: null,
  },
});

export const Block = model<IBlock>("Block", schema);
