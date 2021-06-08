export default interface ApiCategoryDto {
    categoryId: number;
    categoryName: string;
    imagePath: string;
    parentCategoryId: number | null;
}