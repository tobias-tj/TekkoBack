// export class GetBooksByLevel {
//   constructor(private cloudinaryService: CloudinaryServices) {}

//   async execute(level: string) {
//     const books = await this.cloudinaryService.getBooksByLevel(level);

//     if (!books.length) {
//       throw new Error('No books found for this level');
//     }

//     return books;
//   }
// }
