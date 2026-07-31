export const serializeProduct = (product) => {
    
    return product.map((prod) => {
        let catObject = {};
        if(prod.category){
            catObject = {
                "id": prod.category._id,
                "name": prod.category.name,
                "isActive": prod.category.isActive
            }
        }
        return {
            "id": prod._id,
            "name": prod.name,
            "description": prod.description,
            "price": prod.price,
            "images": prod.images[0],
            "rating": prod.rating,
            "reviewCount": prod.reviewCount,
            "stock": prod.stock,
            "category":catObject
        }}
    )
}