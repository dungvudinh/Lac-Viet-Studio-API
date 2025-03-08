export const slugify = (val)=>{
    if(!val) return '';
    return String(val)
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Decomposes characters (e.g., Đ -> D + ˘)
    .replace(/đ/g, "d") // Convert 'đ' to 'd'
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove multiple hyphens
}