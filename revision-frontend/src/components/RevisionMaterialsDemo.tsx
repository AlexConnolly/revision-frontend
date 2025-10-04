import React, { useState, useEffect, useRef } from 'react';
import { useDialog } from './DialogProvider';
import { RevisionMaterial, CreateRevisionMaterialData } from '../types/RevisionMaterial';
import { revisionMaterialRepository } from '../repositories/RevisionMaterialRepository';
import AddRevisionMaterialDialog, { AddRevisionMaterialDialogRef } from './AddRevisionMaterialDialog';

const RevisionMaterialsDemo: React.FC = () => {
  const { showDialogWithResult } = useDialog();
  const [materials, setMaterials] = useState<RevisionMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dialogRef = useRef<AddRevisionMaterialDialogRef>(null);

  // Load materials on component mount
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    setIsLoading(true);
    try {
      const loadedMaterials = revisionMaterialRepository.getAll();
      setMaterials(loadedMaterials);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMaterial = async () => {
    try {
      const result = await showDialogWithResult<CreateRevisionMaterialData>({
        title: "Add Revision Material",
        icon: "📚",
        width: "max-w-2xl",
        component: <AddRevisionMaterialDialog ref={dialogRef} />,
        submit: {
          text: "Save Material",
          onValidate: async () => {
            if (!dialogRef.current?.validateForm()) {
              throw new Error('Please fix the errors in the form');
            }
          },
          onGetResult: async () => {
            const formData = dialogRef.current?.getFormData();
            if (!formData) {
              throw new Error('Failed to get form data');
            }
            return formData;
          }
        }
      });

      // Save the material
      const newMaterial = revisionMaterialRepository.create(result);
      setMaterials(prev => [...prev, newMaterial]);
      
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const success = revisionMaterialRepository.delete(id);
      if (success) {
        setMaterials(prev => prev.filter(material => material.id !== id));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <span className="loader mb-2" />
            <span className="text-text-secondary">Loading materials...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-h1 font-semibold text-text-primary mb-2">
            Revision Materials
          </h2>
          <p className="text-body-sm text-text-secondary">
            Manage your study materials and content
          </p>
        </div>
        <button
          onClick={handleAddMaterial}
          className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue flex items-center"
        >
          <span className="mr-2">📚</span>
          Add Material
        </button>
      </div>

      {/* Materials List */}
      {materials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-h3 font-medium text-text-primary mb-2">
            No materials yet
          </h3>
          <p className="text-body-sm text-text-secondary mb-6">
            Start building your revision collection by adding your first material
          </p>
          <button
            onClick={handleAddMaterial}
            className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
          >
            Add Your First Material
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div
              key={material.id}
              className="p-6 rounded-card border shadow-card bg-warm-white border-light-gray hover:shadow-elevated transition-gentle"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-h3 font-medium text-text-primary flex-1 mr-2">
                  {material.name}
                </h3>
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  className="p-1 rounded-soft text-text-muted hover:text-muted-red hover:bg-muted-red hover:bg-opacity-10 transition-gentle"
                  title="Delete material"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-body-sm text-text-secondary line-clamp-3">
                  {material.extract}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-caption text-text-muted">
                <span>
                  {material.extract.length} characters
                </span>
                <span>
                  {material.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {materials.length > 0 && (
        <div className="mt-8 p-4 rounded-card bg-soft-beige border border-light-gray">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-h2 font-semibold text-text-primary">
                {materials.length}
              </div>
              <div className="text-caption text-text-secondary">
                Total Materials
              </div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-semibold text-text-primary">
                {materials.reduce((total, material) => total + material.extract.length, 0).toLocaleString()}
              </div>
              <div className="text-caption text-text-secondary">
                Total Characters
              </div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-semibold text-text-primary">
                {Math.round(materials.reduce((total, material) => total + material.extract.length, 0) / materials.length)}
              </div>
              <div className="text-caption text-text-secondary">
                Avg. Length
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionMaterialsDemo;
