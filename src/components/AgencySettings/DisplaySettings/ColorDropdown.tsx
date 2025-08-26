import React, { useState, useEffect, useRef } from 'react';

import { HexColorPicker } from 'react-colorful';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select';

import { Input } from '@/components/base/Input';

import { Button } from '@/components/base/Button';

import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from '@/components/base/Popover';

import { cn } from '@/utils/tailwind';

import { getCategoryColors } from '@/utils/categoryColors';

const COLORS = [
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'custom', label: 'Custom' },
];

interface ColorDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  allowCustom?: boolean;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({
  value = 'orange',
  onChange,
  allowCustom = false,
}) => {
  const [isCustomColorOpen, setIsCustomColorOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#ffffff');
  const [selectedValue, setSelectedValue] = useState(value);
  const [lastCustomColor, setLastCustomColor] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCustomValue = value?.startsWith('#');

  useEffect(() => {
    if (value?.startsWith('#')) {
      setCustomColor(value);
      setLastCustomColor(value);
    }
    setSelectedValue(value);
  }, [value]);

  const handleColorChange = (newValue: string) => {
    setSelectedValue(newValue);
    if (newValue === 'custom') {
      // If we have a last custom color, use it as the starting point
      if (lastCustomColor) {
        setCustomColor(lastCustomColor);
      }
      // Small delay to ensure the select closes before opening the color picker
      setTimeout(() => setIsCustomColorOpen(true), 0);
    } else {
      onChange?.(newValue);
    }
  };

  const handleCustomColorSubmit = () => {
    if (customColor) {
      setLastCustomColor(customColor);
      onChange?.(customColor);
      setIsCustomColorOpen(false);
    }
  };

  const handleCustomColorCancel = () => {
    setIsCustomColorOpen(false);
    setSelectedValue(value);
  };

  const handleCustomPreviewClick = (e: React.MouseEvent) => {
    console.log('handleCustomPreviewClick:', e);
    e.preventDefault();
    e.stopPropagation();
    if (lastCustomColor) {
      setCustomColor(lastCustomColor);
    }
    // Small delay to ensure the select closes before opening the color picker
    setTimeout(() => {
      setIsCustomColorOpen(true);
    }, 0);
  };

  return (
    <Popover
      open={isCustomColorOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCustomColorCancel();
        }
        setIsCustomColorOpen(open);
      }}
    >
      <div className="relative" ref={containerRef}>
        <PopoverAnchor asChild>
          <div>
            <Select
              value={isCustomValue ? 'custom' : selectedValue}
              onValueChange={handleColorChange}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-4 h-4 rounded-sm',
                        !isCustomValue && getCategoryColors(value).origin,
                      )}
                      style={
                        isCustomValue ? { backgroundColor: value } : undefined
                      }
                    />
                    <span>
                      {isCustomValue
                        ? 'Custom'
                        : COLORS.find((c) => c.value === value)?.label}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-[8rem]">
                {COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      {color.value === 'custom' ? (
                        <div
                          role="button"
                          tabIndex={0}
                          className={cn(
                            'color-preview w-4 h-4 rounded-sm border border-slate-200 cursor-pointer',
                            'hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                          )}
                          style={
                            lastCustomColor
                              ? { backgroundColor: lastCustomColor }
                              : undefined
                          }
                          onMouseDown={handleCustomPreviewClick}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleCustomPreviewClick(e as any);
                            }
                          }}
                        />
                      ) : (
                        <div
                          className={cn(
                            'w-4 h-4 rounded-sm',
                            getCategoryColors(color.value).origin,
                          )}
                        />
                      )}
                      <span>{color.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverAnchor>

        {allowCustom && (
          <PopoverContent
            className="w-80 p-4"
            align="start"
            side="bottom"
            sideOffset={5}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-4">
                <HexColorPicker
                  color={customColor}
                  onChange={setCustomColor}
                  style={{ width: '100%' }}
                />
                <div className="flex gap-2 items-center">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: customColor }}
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCustomColorCancel}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 body3-semibold text-white leading-[1.0] hover:bg-blue-600"
                  onClick={handleCustomColorSubmit}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        )}
      </div>
    </Popover>
  );
};

export default ColorDropdown;
