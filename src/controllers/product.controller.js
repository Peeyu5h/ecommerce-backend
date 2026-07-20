import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js"

export const createProduct = async (req, res)=> {
    try {
        const categoryId = req.body.category;

        const existingProductCategory = await Category.findById(categoryId);
        if(!existingProductCategory){
            return res.status(404).json({
                message: `Category with ID ${categoryId} not found!`
            });
        }
        const newProduct = new Product(req.body);
        const createdProduct = await newProduct.save();

        res.status(201).json({
            message: "Product added successfully!",
            data: createdProduct
        });

    } catch (error) {
        if(error.name === 'ValidationError'){
            const message = Object.values(error.errors).map(val => val.message);

            return res.status(400).json({
                message: "Failed to add Product",
                error: message
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const {search, category, sort, inStock, order, page = 1, limit=10} = req.query;

        const filter = {};
        const sortedObject = {};

        const allowedSortFields = ["price", "rating", "createdAt", "name"];

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        if(search){
            filter.name = { $regex: search, $options: 'i'};
        }

        if(category){
            if(!mongoose.isValidObjectId(category)){  
                return res.status(401).json({
                    message: "Invalid category Id"
                });
            }
            filter.category = category;
        }

        if(inStock && (inStock === "true" || inStock === "false")){
            filter.stock = inStock === "true" ? { $gt: 1} : { $lt: 1 };
        }

        if(sort && allowedSortFields.includes(sort)){
            sortedObject[sort] =  order === 'desc' ? -1 : 1;
        }

        let allProducts;

        if(Object.keys(sortedObject).length){
            allProducts = await Product.find(filter).populate('category').sort(sortedObject).skip(skip).limit(limitNum);
        }else{
            allProducts = await Product.find(filter).populate('category').skip(skip).limit(limitNum);
        }

        const totalProductsCount = await Product.countDocuments(filter);


        res.status(200).json({
            message: `Product received successfully! Total Products: ${allProducts.length} `,
            allProducts,
            currentPage: pageNum,
            totalPage: Math.ceil(totalProductsCount / limitNum),
            totalProductsCount
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('category');

        if(!product){
            return res.status(404).json({
                message: `Product with ID ${productId} not found.`
            });
        }

        res.status(200).json({
            message: `Found product with ID ${productId}`,
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const updateProductById = async (req, res) => {
    try {
        const payload = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: payload },
            { returnDocument: "after" }
        ).populate('category');

        if(!updatedProduct){
            return res.status(404).json({
                message: `Product with ID ${req.params.id} not found.`,
            });
        }
        res.status(200).json({
            message: "Product updated successfully!",
            updatedProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete( req.params.id );

        if(!deletedProduct){
            return res.status(404).json({
                message: `Product with ID ${req.params.id} not found.`,
            });
        }
        res.status(200).json({
            message: "Product deleted successfully!",
            deletedProduct
        });

    } catch (error) {
        console.log("Inside error of deleteProduct")
        return res.status(500).json({
            message: error.message
        });
    }
}