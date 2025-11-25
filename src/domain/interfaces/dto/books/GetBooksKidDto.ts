export interface GetBooksKidDTO {
  libroId: number;
  nivelId: number;
  titulo: string;
  descripcion?: string;
  totalPaginas: number;
  portada: Buffer;
}
