import Product from "../models/product.model.js"

export const createProduct = async (req, res)=> {
    try {
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
        const allProducts = await Product.find({});

        res.status(200).json({
            message: `Product received successfully! Total Products: ${allProducts.length} `,
            allProducts
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
        const product = await Product.findById(productId);

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
        );

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