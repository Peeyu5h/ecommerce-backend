import Category from "../models/category.model.js";

export const createCategory = async(req, res) => {
    try {
        const { name, description, image, isActive } = req.body;
        
        const existingCategory = await Category.findOne({ name });
        if(existingCategory){
            return res.status(409).json({
                message: "Category already exists!"
            });
        }
        const newCategory = await Category.create({
            name, description, image, isActive
        });

        return res.status(201).json({
            message: "New Category added successfully!",
            newCategory
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getAllCategory = async(req, res) => {
    try {
        const allCategory = await Category.find({ });

        res.status(200).json({
            message: `Categories received successfully! Total Categories: ${allCategory.length} `,
            allCategory
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if(!category){
            return res.status(404).json({
                message: `Category with ID ${categoryId} not found.`
            });
        }

        res.status(200).json({
            message: `Found category with ID ${categoryId}`,
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}