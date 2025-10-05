import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { RevisionMaterial } from '../types/RevisionMaterial';

export interface EditRevisionMaterialDialogRef {
  setFormData: (material: RevisionMaterial) => void;
  getFormData: () => { name: string; extract: string } | null;
  validateForm: () => boolean;
  resetForm: () => void;
}

interface EditRevisionMaterialDialogProps {
  initialMaterial?: RevisionMaterial;
}

const EditRevisionMaterialDialog = forwardRef<EditRevisionMaterialDialogRef, EditRevisionMaterialDialogProps>(({ initialMaterial }, ref) => {
  const [name, setName] = useState(initialMaterial?.name || '');
  const [extract, setExtract] = useState(initialMaterial?.extract || '');
  const [error, setError] = useState<string | null>(null);

  // Update form when initialMaterial changes
  useEffect(() => {
    if (initialMaterial) {
      setName(initialMaterial.name);
      setExtract(initialMaterial.extract);
      setError(null);
    }
  }, [initialMaterial]);

  useImperativeHandle(ref, () => ({
    setFormData: (material: RevisionMaterial) => {
      setName(material.name);
      setExtract(material.extract);
      setError(null);
    },
    getFormData: () => {
      if (!name.trim() || !extract.trim()) {
        return null;
      }
      return { name: name.trim(), extract: extract.trim() };
    },
    validateForm: () => {
      if (!name.trim()) {
        setError('Name is required');
        return false;
      }
      if (!extract.trim()) {
        setError('Extract is required');
        return false;
      }
      setError(null);
      return true;
    },
    resetForm: () => {
      setName('');
      setExtract('');
      setError(null);
    }
  }));

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-body-sm font-medium text-text-primary mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-soft border border-light-gray focus:border-muted-blue focus:outline-none transition-gentle text-body"
          placeholder="Enter material name"
        />
      </div>

      <div>
        <label htmlFor="extract" className="block text-body-sm font-medium text-text-primary mb-2">
          Content
        </label>
        <textarea
          id="extract"
          value={extract}
          onChange={(e) => setExtract(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 rounded-soft border border-light-gray focus:border-muted-blue focus:outline-none transition-gentle text-body resize-vertical"
          placeholder="Enter the content to revise"
        />
      </div>

      {error && (
        <div className="p-4 rounded-soft bg-muted-red bg-opacity-10 border border-muted-red text-muted-red text-body-sm">
          {error}
        </div>
      )}
    </div>
  );
});

EditRevisionMaterialDialog.displayName = 'EditRevisionMaterialDialog';

export default EditRevisionMaterialDialog;
