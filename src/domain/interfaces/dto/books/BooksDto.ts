export interface BookDTO {
  nivelId: number;
  titulo: string;
  descripcion?: string;
  totalPaginas: number;
  pdf: Buffer;
  portada: Buffer;
}
