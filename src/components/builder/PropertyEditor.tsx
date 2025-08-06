"use client";

import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { Section, SectionProps, ValidationError } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSectionTemplateById } from "@/data/section-templates";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { BREAKPOINTS } from "@/utils/constants";
import {
  HeaderSectionPropsSchema,
  HeroSectionPropsSchema,
  ContentSectionPropsSchema,
  FooterSectionPropsSchema,
  ImageUrlSchema,
  UrlSchema,
} from "@/types";

interface PropertyEditorProps {
  section: Section | null;
  onSectionUpdate: (id: string, props: Record<string, any>) => void;
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "image" | "color" | "select" | "array";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => ValidationError | null;
  required?: boolean;
}

// Debounce hook for optimized updates
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PropertyEditor: React.FC<PropertyEditorProps> = React.memo(
  ({ section, onSectionUpdate }) => {
    const [localProps, setLocalProps] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, ValidationError>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [lastSavedProps, setLastSavedProps] = useState<Record<string, any>>(
      {}
    );
    const isUpdatingRef = useRef(false);
    const lastProcessedPropsRef = useRef<string>("");
    const [isMobile, setIsMobile] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Check if we're on mobile
    useEffect(() => {
      const checkIfMobile = () => {
        const mobileBreakpoint = parseInt(
          BREAKPOINTS.tablet.replace("px", ""),
          10
        );
        setIsMobile(window.innerWidth < mobileBreakpoint);
      };

      // Initial check
      checkIfMobile();

      // Add event listener for resize
      window.addEventListener("resize", checkIfMobile);

      // Cleanup
      return () => {
        window.removeEventListener("resize", checkIfMobile);
      };
    }, []);

    // Initialize local props when section changes
    useEffect(() => {
      if (section) {
        setLocalProps(section.props);
        setLastSavedProps(section.props);
        setIsDirty(false);
        setErrors({});
        isUpdatingRef.current = false;
        lastProcessedPropsRef.current = JSON.stringify(section.props);
        // Auto-expand when section is selected
        setIsCollapsed(false);
      }
    }, [section?.id]);

    // Debounced props for real-time updates
    const debouncedProps = useDebounce(localProps, 300);

    // Check for validation errors (excluding update errors)
    const hasValidationErrors = useMemo(() => {
      return Object.keys(errors).some((key) => key !== "_updateError");
    }, [errors]);

    // Update section when debounced props change with error handling and rollback
    useEffect(() => {
      if (
        section &&
        isDirty &&
        !hasValidationErrors &&
        !isUpdatingRef.current
      ) {
        const currentPropsString = JSON.stringify(debouncedProps);

        // Skip if we've already processed these exact props
        if (currentPropsString === lastProcessedPropsRef.current) {
          return;
        }

        isUpdatingRef.current = true;
        lastProcessedPropsRef.current = currentPropsString;

        try {
          onSectionUpdate(section.id, debouncedProps);
          setLastSavedProps(debouncedProps);
          setIsDirty(false);
          // Clear any previous update errors
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors._updateError;
            return newErrors;
          });
        } catch (error) {
          console.error("Failed to update section:", error);
          // Rollback to last saved state on error
          setLocalProps(section.props);
          setIsDirty(false);
          // Add error state for failed updates
          setErrors((prev) => ({
            ...prev,
            _updateError: {
              field: "_updateError",
              message: "Failed to save changes. Reverted to last saved state.",
            },
          }));
        } finally {
          isUpdatingRef.current = false;
        }
      }
    }, [
      debouncedProps,
      section?.id,
      onSectionUpdate,
      isDirty,
      hasValidationErrors,
    ]);

    // Memoized field configurations based on section type
    const fieldConfigs = useMemo((): FieldConfig[] => {
      if (!section) return [];

      const baseFields: FieldConfig[] = [
        {
          key: "backgroundColor",
          label: "Background Color",
          type: "color",
          placeholder: "#ffffff",
        },
        {
          key: "textColor",
          label: "Text Color",
          type: "color",
          placeholder: "#000000",
        },
      ];

      switch (section.type) {
        case "header":
          return [
            {
              key: "title",
              label: "Site Title",
              type: "text",
              placeholder: "Your Website",
              required: true,
            },
            {
              key: "logoUrl",
              label: "Logo URL",
              type: "image",
              placeholder: "https://example.com/logo.png",
              validation: (value) => {
                if (!value) return null;
                const result = ImageUrlSchema.safeParse(value);
                return result.success
                  ? null
                  : {
                      field: "logoUrl",
                      message:
                        result.error.issues?.[0]?.message ||
                        "Invalid image URL",
                    };
              },
            },
            ...baseFields,
          ];

        case "hero":
          return [
            {
              key: "title",
              label: "Title",
              type: "text",
              placeholder: "Welcome to Our Website",
              required: true,
            },
            {
              key: "subtitle",
              label: "Subtitle",
              type: "text",
              placeholder: "Create amazing experiences",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Tell your story here...",
            },
            {
              key: "ctaText",
              label: "Button Text",
              type: "text",
              placeholder: "Get Started",
            },
            {
              key: "ctaLink",
              label: "Button URL",
              type: "url",
              placeholder: "https://example.com",
              validation: (value) => {
                if (!value) return null;
                const result = UrlSchema.safeParse(value);
                return result.success
                  ? null
                  : { field: "ctaLink", message: "Invalid URL format" };
              },
            },
            {
              key: "backgroundImage",
              label: "Background Image",
              type: "image",
              placeholder: "https://example.com/hero-bg.jpg",
              validation: (value) => {
                if (!value) return null;
                const result = ImageUrlSchema.safeParse(value);
                return result.success
                  ? null
                  : {
                      field: "backgroundImage",
                      message:
                        result.error.issues?.[0]?.message ||
                        "Invalid image URL",
                    };
              },
            },
            ...baseFields,
          ];

        case "content":
          return [
            {
              key: "title",
              label: "Title",
              type: "text",
              placeholder: "Section Title",
              required: true,
            },
            {
              key: "content",
              label: "Content",
              type: "textarea",
              placeholder: "Enter your content here...",
              required: true,
            },
            {
              key: "imageUrl",
              label: "Image URL",
              type: "image",
              placeholder: "https://example.com/image.jpg",
              validation: (value) => {
                if (!value) return null;
                const result = ImageUrlSchema.safeParse(value);
                return result.success
                  ? null
                  : {
                      field: "imageUrl",
                      message:
                        result.error.issues?.[0]?.message ||
                        "Invalid image URL",
                    };
              },
            },
            {
              key: "imagePosition",
              label: "Image Position",
              type: "select",
              options: [
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
                { value: "top", label: "Top" },
                { value: "bottom", label: "Bottom" },
              ],
            },
            ...baseFields,
          ];

        case "footer":
          return [
            {
              key: "copyright",
              label: "Copyright Text",
              type: "text",
              placeholder: "© 2024 Your Company. All rights reserved.",
            },
            ...baseFields,
          ];

        default:
          return baseFields;
      }
    }, [section?.type]);

    // Memoized validation function
    const validateField = useCallback(
      (key: string, value: any): ValidationError | null => {
        const fieldConfig = fieldConfigs.find((config) => config.key === key);

        if (!fieldConfig) return null;

        // Required field validation
        if (
          fieldConfig.required &&
          (!value || value.toString().trim() === "")
        ) {
          return { field: key, message: `${fieldConfig.label} is required` };
        }

        // Custom validation
        if (fieldConfig.validation) {
          return fieldConfig.validation(value);
        }

        return null;
      },
      [fieldConfigs]
    );

    // Optimized change handler with validation
    const handleFieldChange = useCallback(
      (key: string, value: any) => {
        setLocalProps((prev) => ({ ...prev, [key]: value }));
        setIsDirty(true);

        // Validate field
        const error = validateField(key, value);
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors[key] = error;
          } else {
            delete newErrors[key];
            // Also clear update errors when fixing validation errors
            delete newErrors._updateError;
          }
          return newErrors;
        });
      },
      [validateField]
    );

    // Manual rollback function
    const handleRollback = useCallback(() => {
      if (section) {
        setLocalProps(lastSavedProps);
        setIsDirty(false);
        setErrors({});
        lastProcessedPropsRef.current = JSON.stringify(lastSavedProps);
      }
    }, [section, lastSavedProps]);

    // Toggle collapse state for mobile
    const toggleCollapse = useCallback(() => {
      setIsCollapsed((prev) => !prev);
    }, []);

    // Memoized field renderers
    const renderField = useCallback(
      (config: FieldConfig) => {
        const value = localProps[config.key] || "";
        const error = errors[config.key];
        const hasError = !!error;

        const fieldId = `field-${config.key}`;
        const commonProps = {
          id: fieldId,
          value,
          placeholder: config.placeholder,
          className: hasError ? "border-red-500 focus:ring-red-500" : "",
        };

        switch (config.type) {
          case "text":
          case "url":
          case "image":
            return (
              <Input
                {...commonProps}
                type={config.type === "url" ? "url" : "text"}
                onChange={(e) => handleFieldChange(config.key, e.target.value)}
              />
            );

          case "textarea":
            return (
              <Textarea
                {...commonProps}
                onChange={(e) => handleFieldChange(config.key, e.target.value)}
                rows={isMobile ? 3 : 4}
              />
            );

          case "color":
            return (
              <div className="flex space-x-2">
                <Input
                  {...commonProps}
                  type="color"
                  className="w-16 h-10 p-1 border rounded"
                  onChange={(e) =>
                    handleFieldChange(config.key, e.target.value)
                  }
                />
                <Input
                  {...commonProps}
                  type="text"
                  className="flex-1"
                  onChange={(e) =>
                    handleFieldChange(config.key, e.target.value)
                  }
                />
              </div>
            );

          case "select":
            return (
              <Select
                value={value}
                onValueChange={(newValue) =>
                  handleFieldChange(config.key, newValue)
                }
              >
                <SelectTrigger className={hasError ? "border-red-500" : ""}>
                  <SelectValue placeholder={config.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {config.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );

          default:
            return null;
        }
      },
      [localProps, errors, handleFieldChange, isMobile]
    );

    if (!section) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-lg mx-auto flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                No section selected
              </h3>
              <p className="text-xs text-muted-foreground">
                Select a section from the preview to edit its properties
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const template = getSectionTemplateById(section.type);

    // Mobile floating editor
    if (isMobile) {
      return (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
            isCollapsed ? "translate-y-[calc(100%-3.5rem)]" : "translate-y-0"
          }`}
        >
          {/* Drag handle / Header */}
          <div
            className="bg-primary text-primary-foreground px-4 py-3 rounded-t-lg shadow-lg flex items-center justify-between cursor-pointer"
            onClick={toggleCollapse}
          >
            <div className="flex items-center">
              <div className="mr-2">
                {isCollapsed ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
              <h3 className="font-medium text-sm">
                {isCollapsed
                  ? "Edit Properties"
                  : template?.name || "Properties"}
              </h3>
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(true);
                }}
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Editor content */}
          <div className="bg-card border-x border-b border-border rounded-b-lg shadow-lg max-h-[70vh] overflow-y-auto">
            <div className="p-4 space-y-3">
              {fieldConfigs.map((config) => (
                <div key={config.key} className="space-y-1.5">
                  <Label
                    htmlFor={`field-${config.key}`}
                    className={`text-xs font-medium ${
                      config.required
                        ? 'after:content-["*"] after:text-red-500 after:ml-1'
                        : ""
                    }`}
                  >
                    {config.label}
                  </Label>
                  {renderField(config)}
                  {errors[config.key] && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors[config.key]?.message}
                    </p>
                  )}
                </div>
              ))}

              {Object.keys(errors).length > 0 && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-red-700 font-medium">
                        {errors._updateError
                          ? "Update failed:"
                          : "Please fix the errors:"}
                      </p>
                      <ul className="text-xs text-red-600 mt-1 space-y-0.5">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>• {error.message}</li>
                        ))}
                      </ul>
                    </div>
                    {errors._updateError && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRollback();
                        }}
                        className="ml-2 text-xs"
                      >
                        Revert
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {isDirty && !hasValidationErrors && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs text-green-700">
                    ✓ Changes saved automatically
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Desktop editor
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Properties</span>
            {template && (
              <span className="text-sm font-normal text-muted-foreground">
                {template.name}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fieldConfigs.map((config) => (
            <div key={config.key} className="space-y-2">
              <Label
                htmlFor={`field-${config.key}`}
                className={`text-sm font-medium ${
                  config.required
                    ? 'after:content-["*"] after:text-red-500 after:ml-1'
                    : ""
                }`}
              >
                {config.label}
              </Label>
              {renderField(config)}
              {errors[config.key] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[config.key]?.message}
                </p>
              )}
            </div>
          ))}

          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium">
                    {errors._updateError
                      ? "Update failed:"
                      : "Please fix the following errors:"}
                  </p>
                  <ul className="text-xs text-red-600 mt-1 space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>• {error.message}</li>
                    ))}
                  </ul>
                </div>
                {errors._updateError && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRollback}
                    className="ml-2 text-xs"
                  >
                    Revert
                  </Button>
                )}
              </div>
            </div>
          )}

          {isDirty && !hasValidationErrors && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                ✓ Changes saved automatically
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

PropertyEditor.displayName = "PropertyEditor";

export default PropertyEditor;
