import { RevisionMaterial, CreateRevisionMaterialData } from '../types/RevisionMaterial';

const STORAGE_KEY = 'revision-materials';

export class RevisionMaterialRepository {
  private static instance: RevisionMaterialRepository;
  
  private constructor() {}
  
  public static getInstance(): RevisionMaterialRepository {
    if (!RevisionMaterialRepository.instance) {
      RevisionMaterialRepository.instance = new RevisionMaterialRepository();
    }
    return RevisionMaterialRepository.instance;
  }

  /**
   * Get all revision materials from localStorage
   */
  public getAll(): RevisionMaterial[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const materials = JSON.parse(stored);
      // Convert date strings back to Date objects
      return materials.map((material: any) => ({
        ...material,
        createdAt: new Date(material.createdAt),
        updatedAt: new Date(material.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading revision materials:', error);
      return [];
    }
  }

  /**
   * Get a specific revision material by ID
   */
  public getById(id: string): RevisionMaterial | null {
    const materials = this.getAll();
    return materials.find(material => material.id === id) || null;
  }

  /**
   * Create a new revision material
   */
  public create(data: CreateRevisionMaterialData): RevisionMaterial {
    const materials = this.getAll();
    const now = new Date();
    
    const newMaterial: RevisionMaterial = {
      id: this.generateId(),
      name: data.name.trim(),
      extract: data.extract.trim(),
      createdAt: now,
      updatedAt: now
    };

    const updatedMaterials = [...materials, newMaterial];
    this.saveAll(updatedMaterials);
    
    return newMaterial;
  }

  /**
   * Update an existing revision material
   */
  public update(id: string, data: Partial<CreateRevisionMaterialData>): RevisionMaterial | null {
    const materials = this.getAll();
    const index = materials.findIndex(material => material.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedMaterial: RevisionMaterial = {
      ...materials[index],
      ...data,
      updatedAt: new Date()
    };

    // Trim whitespace if name or extract are provided
    if (data.name !== undefined) {
      updatedMaterial.name = data.name.trim();
    }
    if (data.extract !== undefined) {
      updatedMaterial.extract = data.extract.trim();
    }

    const updatedMaterials = [...materials];
    updatedMaterials[index] = updatedMaterial;
    this.saveAll(updatedMaterials);

    return updatedMaterial;
  }

  /**
   * Delete a revision material by ID
   */
  public delete(id: string): boolean {
    const materials = this.getAll();
    const filteredMaterials = materials.filter(material => material.id !== id);
    
    if (filteredMaterials.length === materials.length) {
      return false; // Material not found
    }

    this.saveAll(filteredMaterials);
    return true;
  }

  /**
   * Search revision materials by name or extract content
   */
  public search(query: string): RevisionMaterial[] {
    const materials = this.getAll();
    const lowercaseQuery = query.toLowerCase().trim();
    
    if (!lowercaseQuery) {
      return materials;
    }

    return materials.filter(material => 
      material.name.toLowerCase().includes(lowercaseQuery) ||
      material.extract.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Clear all revision materials
   */
  public clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get the count of revision materials
   */
  public getCount(): number {
    return this.getAll().length;
  }

  /**
   * Private helper to save all materials to localStorage
   */
  private saveAll(materials: RevisionMaterial[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
    } catch (error) {
      console.error('Error saving revision materials:', error);
      throw new Error('Failed to save revision materials. Storage may be full.');
    }
  }

  /**
   * Private helper to generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export a singleton instance for easy use
export const revisionMaterialRepository = RevisionMaterialRepository.getInstance();
