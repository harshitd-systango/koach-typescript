import mongoose, { Document, Schema } from 'mongoose';

export interface BookAttributes {
    name?: string;
    author_name?: string;
    category?: string;
    price?: number;
    total_page?: number;
}

export interface BookInstance extends Document{
    id: number;
    createdAt: Date;
    updatedAt: Date;

    name: string;
    author_name: string;
    category: string;
    price: number;
    total_page: number;

}


const BookSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true},
    price: { type: Number, required: true },
    // total_page: { type: Number, required: true},
    author_name: { type: String }
});
  
  // Export the model and return your IUser interface
  export default mongoose.model<BookInstance>('Book', BookSchema);