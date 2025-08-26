import React from 'react';

import { XMarkIcon, Bars2Icon } from '@heroicons/react/24/outline';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { Dialog, DialogContent } from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';

import {
  CustomFieldDefinition,
  CustomFieldEntityType,
  EntityTypeWithCustomFields,
} from '@/store/slices/customFieldDefinitionsSlice';

const fieldTypeOptions = [
  { value: 'Text', label: 'Text' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Date', label: 'Date' },
  { value: 'File Upload', label: 'File Upload' },
];

interface ManageCustomFieldsProps {
  open: boolean;
  onClose: () => void;
  entityType: EntityTypeWithCustomFields;
  fields: CustomFieldDefinition[];
  newFieldName: string;
  newFieldType: string;
  error: string;
  onNewFieldNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewFieldTypeChange: (value: string) => void;
  onAddField: () => void;
  onRemoveField: (fieldName: string) => void;
  onSave: () => void;
  onDragEnd: OnDragEndResponder;
}

export const ManageCustomFields: React.FC<ManageCustomFieldsProps> = ({
  open,
  onClose,
  entityType,
  fields,
  newFieldName,
  newFieldType,
  error,
  onNewFieldNameChange,
  onNewFieldTypeChange,
  onAddField,
  onRemoveField,
  onSave,
  onDragEnd,
}) => {
  const getReadableEntityType = (typeKey: EntityTypeWithCustomFields) => {
    switch (typeKey) {
      case CustomFieldEntityType.AgencyEntity:
        return 'Agency';
      case CustomFieldEntityType.SchoolEntity:
        return 'School';
      case CustomFieldEntityType.NetworkEntity:
        return 'Network';
      case CustomFieldEntityType.BoardMember:
        return 'Board Member';
      case CustomFieldEntityType.AgencyUser:
        return 'Agency User';
      case CustomFieldEntityType.SchoolUser:
        return 'School User';
      default:
        return 'Entity';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] h-[607px] bg-white p-0 flex flex-col gap-0 rounded-[8px]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-xl font-medium">
            Manage {getReadableEntityType(entityType)} Custom Fields
          </h3>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col w-1/2 border-r border-slate-200">
              <p className="body2-medium p-[8px_16px] bg-slate-50 border-b border-slate-200 flex-shrink-0">
                Add custom field
              </p>
              <div className="flex flex-col p-4 gap-4 flex-1 overflow-y-auto">
                <div>
                  <CustomInput
                    label="Field Name"
                    name="fieldName"
                    value={newFieldName}
                    onChange={onNewFieldNameChange}
                    placeholder="Enter field name"
                    required
                    error={error}
                  />
                </div>
                <div>
                  <Dropdown
                    label="Type"
                    value={newFieldType}
                    onValueChange={onNewFieldTypeChange}
                    options={fieldTypeOptions}
                    required
                  />
                </div>
                <Button
                  onClick={onAddField}
                  className="bg-blue-500 text-white hover:bg-blue-600 w-[72px] h-[36px] mt-auto self-start"
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <p className="body2-medium p-[8px_16px] bg-slate-50 border-b border-slate-200 flex-shrink-0">
                Custom Fields
              </p>
              <div className="flex-1 overflow-y-auto">
                <Droppable droppableId="customFieldsList">
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="relative flex flex-col p-4 gap-4"
                    >
                      {fields.map((field, index) => (
                        <Draggable
                          key={field.Name}
                          draggableId={field.Name}
                          index={index}
                        >
                          {(
                            providedDraggable: DraggableProvided,
                            snapshot: DraggableStateSnapshot,
                          ) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center px-2 py-2 hover:bg-slate-50 rounded-md group ${snapshot.isDragging ? 'opacity-50 bg-slate-100' : ''}`}
                            >
                              <div
                                {...providedDraggable.dragHandleProps}
                                className="cursor-move p-1"
                              >
                                <Bars2Icon className="w-4 h-4 text-slate-400" />
                              </div>
                              <span
                                className="text-slate-900 truncate"
                                title={field.Name}
                              >
                                {field.Name}
                              </span>
                              <span className="text-slate-500">
                                {field.Type}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onRemoveField(field.Name)}
                              >
                                <XMarkIcon className="h-4 w-4 text-slate-500 hover:text-red-500" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>

        <div className="flex justify-end gap-2 p-4 border-t border-slate-200 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-blue-500 text-white hover:bg-blue-600 w-[100px]"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
