import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../components/DialogProvider';
import { RevisionMaterial, CreateRevisionMaterialData } from '../types/RevisionMaterial';
import { revisionMaterialRepository } from '../repositories/RevisionMaterialRepository';
import AddRevisionMaterialDialog, { AddRevisionMaterialDialogRef } from '../components/AddRevisionMaterialDialog';
import EditRevisionMaterialDialog, { EditRevisionMaterialDialogRef } from '../components/EditRevisionMaterialDialog';

const MaterialsPage: React.FC = () => {
  const { showDialogWithResult } = useDialog();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<RevisionMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dialogRef = useRef<AddRevisionMaterialDialogRef>(null);
  const editDialogRef = useRef<EditRevisionMaterialDialogRef>(null);

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

  const handleFillTheWord = (id: string) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      console.log('Starting Fill the Word for:', material.name);
      navigate(`/fill-the-word/${id}`);
    }
  };

  const handleSayItOutLoud = (id: string) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      console.log('Starting Say It Out Loud for:', material.name);
      navigate(`/say-it-out-loud/${id}`);
    }
  };

  const handleEditMaterial = async (material: RevisionMaterial) => {
    try {
      const result = await showDialogWithResult<CreateRevisionMaterialData>({
        title: "Edit Revision Material",
        icon: "✏️",
        width: "max-w-2xl",
        component: <EditRevisionMaterialDialog ref={editDialogRef} initialMaterial={material} />,
        submit: {
          text: "Update Material",
          onValidate: async () => {
            if (!editDialogRef.current?.validateForm()) {
              throw new Error('Please fix the errors in the form');
            }
          },
          onGetResult: async () => {
            const formData = editDialogRef.current?.getFormData();
            if (!formData) {
              throw new Error('Failed to get form data');
            }
            return formData;
          }
        }
      });

      // Update the material
      const updatedMaterial = revisionMaterialRepository.update(material.id, result);
      if (updatedMaterial) {
        setMaterials(prev => prev.map(m => m.id === material.id ? updatedMaterial : m));
      }
      
    } catch (error) {
      console.error('Error editing material:', error);
    } finally {
      // Reset the form after dialog closes
      editDialogRef.current?.resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center">
            <span className="loader mb-4" />
            <span className="text-body text-text-secondary">Loading your materials...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display font-bold text-text-primary mb-2">
              Revision Materials
            </h1>
            <p className="text-body-lg text-text-secondary">
              Organize and manage your study content
            </p>
          </div>
          {materials.length > 0 && (
            <button
              onClick={handleAddMaterial}
              className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue flex items-center"
            >
              <span className="mr-2">📚</span>
              Add Material
            </button>
          )}
        </div>

        {/* Empty State */}
        {materials.length === 0 ? (
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              {/* Large Icon */}
              <div className="text-8xl mb-6 opacity-60">📚</div>
              
              {/* Main Message */}
              <h2 className="text-h1 font-semibold text-text-primary mb-4">
                Start Building Your Knowledge Base
              </h2>
              <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
                Create your first revision material to begin organizing your study content. 
                Add notes, summaries, or any content you want to review later.
              </p>
              
              {/* Call to Action */}
              <button
                onClick={handleAddMaterial}
                className="px-8 py-4 rounded-card font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue text-body-lg shadow-card hover:shadow-elevated"
              >
                <span className="mr-2">📝</span>
                Create Your First Material
              </button>
              
            </div>
          </div>
        ) : (
          <>
            {/* Materials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="p-6 rounded-card border shadow-card bg-warm-white border-light-gray hover:shadow-elevated transition-gentle group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-h3 font-medium text-text-primary flex-1 mr-2 line-clamp-2">
                      {material.name}
                    </h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-gentle">
                      <button
                        onClick={() => handleEditMaterial(material)}
                        className="p-2 rounded-soft text-text-muted hover:text-muted-blue hover:bg-muted-blue hover:bg-opacity-10 transition-gentle"
                        title="Edit material"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="p-2 rounded-soft text-text-muted hover:text-muted-red hover:bg-muted-red hover:bg-opacity-10 transition-gentle"
                        title="Delete material"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p 
                      className="text-body-sm text-text-secondary leading-relaxed overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {material.extract}
                    </p>
                  </div>
                  
                  {/* Revise Section */}
                  <div className="pt-4 border-t border-light-gray">
                    <h4 className="text-body-sm font-medium text-text-primary mb-3">
                      Revise
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFillTheWord(material.id)}
                        className="w-full px-4 py-2 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-forest-green text-body-sm"
                      >
                        <span className="mr-2">✏️</span>
                        Fill the word
                      </button>
                      <button
                        onClick={() => handleSayItOutLoud(material.id)}
                        className="w-full px-4 py-2 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue text-body-sm"
                      >
                        <span className="mr-2">🗣️</span>
                        Say it out loud
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-caption text-text-muted pt-3 mt-4 border-t border-light-gray">
                    <span className="flex items-center">
                      <span className="mr-1">📊</span>
                      {material.extract.length.toLocaleString()} chars
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">📅</span>
                      {material.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="p-6 rounded-card bg-warm-white border border-light-gray shadow-soft">
              <h3 className="text-h3 font-medium text-text-primary mb-4">
                📈 Your Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-h1 font-bold text-muted-blue mb-1">
                    {materials.length}
                  </div>
                  <div className="text-body-sm text-text-secondary">
                    {materials.length === 1 ? 'Material' : 'Materials'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-h1 font-bold text-forest-green mb-1">
                    {materials.reduce((total, material) => total + material.extract.length, 0).toLocaleString()}
                  </div>
                  <div className="text-body-sm text-text-secondary">
                    Total Characters
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-h1 font-bold text-soft-orange mb-1">
                    {materials.length > 0 ? Math.round(materials.reduce((total, material) => total + material.extract.length, 0) / materials.length) : 0}
                  </div>
                  <div className="text-body-sm text-text-secondary">
                    Avg. Length
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default MaterialsPage;
