export interface RevisionMaterial {
  id: string;
  name: string;
  extract: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRevisionMaterialData {
  name: string;
  extract: string;
}
