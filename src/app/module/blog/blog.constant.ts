export const BlogSearchableFields = ['title'];
export const BlogFilterableFields: string[] = ['searchTerm', 'title'];
export const BlogRelationalFields: string[] = ['authorId'];
export const BlogRelationalFieldsMapper: { [key: string]: string } = {
  authorId: 'user',
};
