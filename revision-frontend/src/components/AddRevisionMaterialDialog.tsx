import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { CreateRevisionMaterialData } from '../types/RevisionMaterial';

interface AddRevisionMaterialDialogProps {}

export interface AddRevisionMaterialDialogRef {
  getFormData: () => CreateRevisionMaterialData;
  validateForm: () => boolean;
  resetForm: () => void;
}

const AddRevisionMaterialDialog = forwardRef<AddRevisionMaterialDialogRef, AddRevisionMaterialDialogProps>((props, ref) => {
  const [formData, setFormData] = useState<CreateRevisionMaterialData>({
    name: '',
    extract: ''
  });
  const [errors, setErrors] = useState<Partial<CreateRevisionMaterialData>>({});

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    validateForm: () => {
      const isValid = validateForm();
      return isValid;
    },
    resetForm: () => {
      setFormData({ name: '', extract: '' });
      setErrors({});
    }
  }));

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateRevisionMaterialData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.extract.trim()) {
      newErrors.extract = 'Content is required';
    } else if (formData.extract.trim().length < 10) {
      newErrors.extract = 'Content must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateRevisionMaterialData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-body-sm text-text-secondary">
          Add new revision material to your study collection
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="material-name" className="block text-body-sm font-medium text-text-primary mb-2">
            Material Name *
          </label>
          <input
            id="material-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Biology Chapter 5, Math Formulas, History Notes"
            className={`w-full px-4 py-3 rounded-soft border transition-gentle focus:outline-none focus:ring-2 ${
              errors.name 
                ? 'border-muted-red focus:border-muted-red focus:ring-muted-red focus:ring-opacity-20' 
                : 'border-light-gray focus:border-muted-blue focus:ring-muted-blue focus:ring-opacity-20'
            } bg-warm-white text-text-primary placeholder-text-placeholder`}
          />
          {errors.name && (
            <p className="mt-1 text-caption text-muted-red">
              {errors.name}
            </p>
          )}
        </div>

        {/* Extract Field */}
        <div>
          <label htmlFor="material-extract" className="block text-body-sm font-medium text-text-primary mb-2">
            Content *
          </label>
          <textarea
            id="material-extract"
            value={formData.extract}
            onChange={(e) => handleInputChange('extract', e.target.value)}
            placeholder="Paste or type your revision content here..."
            rows={8}
            className={`w-full px-4 py-3 rounded-soft border transition-gentle focus:outline-none focus:ring-2 resize-none ${
              errors.extract 
                ? 'border-muted-red focus:border-muted-red focus:ring-muted-red focus:ring-opacity-20' 
                : 'border-light-gray focus:border-muted-blue focus:ring-muted-blue focus:ring-opacity-20'
            } bg-warm-white text-text-primary placeholder-text-placeholder`}
          />
          <div className="flex justify-between items-center mt-2">
            {errors.extract ? (
              <p className="text-caption text-muted-red">
                {errors.extract}
              </p>
            ) : (
              <p className="text-caption text-text-muted">
                {formData.extract.length} characters
              </p>
            )}
            <p className="text-caption text-text-muted">
              Minimum 10 characters required
            </p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="p-4 rounded-soft bg-soft-beige border border-light-gray">
        <h4 className="text-body-sm font-medium text-text-primary mb-2">
          💡 Tips for effective revision materials:
        </h4>
        <ul className="text-caption text-text-secondary space-y-1">
          <li>• Use clear, descriptive names for easy organization</li>
          <li>• Include key concepts, definitions, and examples</li>
          <li>• Break down complex topics into digestible sections</li>
          <li>• Add your own notes and explanations</li>
        </ul>
      </div>
    </div>
  );
});

AddRevisionMaterialDialog.displayName = 'AddRevisionMaterialDialog';

export default AddRevisionMaterialDialog;
