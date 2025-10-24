import React from 'react';
import { Input, Select } from '../ui/Input';

interface InstructionMetadataEditorProps {
  register: any;
  errors?: any;
}

export const InstructionMetadataEditor: React.FC<InstructionMetadataEditorProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Metadata</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Author"
          {...register('author')}
          placeholder="Enter author name"
          error={errors?.author?.message}
        />
        <Input
          label="Version"
          {...register('version')}
          placeholder="1.0"
          error={errors?.version?.message}
        />
        <Select
          label="Difficulty"
          options={[
            { label: 'Beginner', value: 'BEGINNER' },
            { label: 'Intermediate', value: 'INTERMEDIATE' },
            { label: 'Advanced', value: 'ADVANCED' }
          ]}
          {...register('difficulty')}
          error={errors?.difficulty?.message}
        />
        <Input
          label="Estimated Time (minutes)"
          type="number"
          {...register('estimatedTime')}
          placeholder="30"
          error={errors?.estimatedTime?.message}
        />
      </div>
      <div className="mt-4 space-y-4">
        <Input
          label="Prerequisites (comma-separated)"
          {...register('prerequisites')}
          placeholder="Basic knowledge of..."
          error={errors?.prerequisites?.message}
        />
        <Input
          label="Expected Outputs (comma-separated)"
          {...register('outputs')}
          placeholder="Report, analysis, summary..."
          error={errors?.outputs?.message}
        />
      </div>
    </div>
  );
};