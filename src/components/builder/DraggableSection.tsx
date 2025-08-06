"use client";

import React, { useRef, useEffect, useState } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { GripVertical, Move } from "lucide-react";

import { Section } from "@/types";
import { useBuilderStore } from "@/stores/builder-store";
import { BREAKPOINTS } from "@/utils/constants";

interface DraggableSectionProps {
  section: Section;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

interface DragItem {
  type: string;
  id: string;
  index: number;
}

const SECTION_TYPE = "SECTION";

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  isSelected,
  onSelect,
  onDelete,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { reorderSections, setDragging } = useBuilderStore();
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDragging, setTouchDragging] = useState(false);
  const [autoScrolling, setAutoScrolling] = useState(false);
  const autoScrollTimerRef = useRef<number | null>(null);

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

  const [{ isDragging }, drag, preview] = useDrag({
    type: SECTION_TYPE,
    item: (): DragItem => {
      try {
        setDragging(true, section.id);
        return {
          type: SECTION_TYPE,
          id: section.id,
          index,
        };
      } catch (error) {
        console.error("Error starting drag operation:", error);
        setDragging(false);
        throw error;
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_item, monitor) => {
      try {
        setDragging(false);

        // Check if the drop was successful
        const dropResult = monitor.getDropResult();
        if (!dropResult && monitor.didDrop()) {
          // Drop was attempted but failed - could add user feedback here
          console.warn("Drag operation completed but drop failed");
        }
      } catch (error) {
        console.error(
          "Error ending drag operation:",
          error instanceof Error ? error.message : String(error)
        );
        setDragging(false);
      }
    },
  });

  // Hide the default drag preview since we're using a custom drag layer
  React.useEffect(() => {
    preview(null, { captureDraggingState: true });
  }, [preview]);

  // Handle ESC key to cancel drag
  useEffect(() => {
    if (typeof isDragging === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }

    // Return cleanup function for all code paths
    return () => {};
  }, [isDragging, setDragging]);

  // Auto-scroll function for mobile drag
  const handleAutoScroll = (clientY: number) => {
    if (!isMobile || !touchDragging) return;

    const viewportHeight = window.innerHeight;
    const scrollThreshold = 100; // pixels from top/bottom to trigger scrolling
    const scrollSpeed = 5; // pixels per tick

    // Clear any existing auto-scroll timer
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }

    // Check if we're near the top or bottom edge
    if (clientY < scrollThreshold) {
      // Near top edge, scroll up
      setAutoScrolling(true);
      autoScrollTimerRef.current = window.setInterval(() => {
        window.scrollBy(0, -scrollSpeed);
      }, 16); // ~60fps
    } else if (clientY > viewportHeight - scrollThreshold) {
      // Near bottom edge, scroll down
      setAutoScrolling(true);
      autoScrollTimerRef.current = window.setInterval(() => {
        window.scrollBy(0, scrollSpeed);
      }, 16); // ~60fps
    } else if (autoScrolling) {
      // Not near edges, stop scrolling
      setAutoScrolling(false);
    }
  };

  // Clean up auto-scroll timer on unmount or when drag ends
  useEffect(() => {
    return () => {
      if (autoScrollTimerRef.current !== null) {
        window.clearInterval(autoScrollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!touchDragging && autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
      setAutoScrolling(false);
    }
  }, [touchDragging]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: SECTION_TYPE,
    hover: (draggedItem: DragItem, monitor: DropTargetMonitor) => {
      try {
        if (!ref.current) {
          return;
        }

        const dragIndex = draggedItem.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Validate indices
        if (typeof dragIndex !== "number" || typeof hoverIndex !== "number") {
          console.warn("Invalid drag indices:", { dragIndex, hoverIndex });
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) {
          return;
        }

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        // Time to actually perform the action
        reorderSections(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        draggedItem.index = hoverIndex;
      } catch (error) {
        console.error("Error during drag hover:", error);
        // Reset drag state on error
        setDragging(false);
      }
    },
    drop: (draggedItem: DragItem) => {
      try {
        // Return a drop result to indicate successful drop
        return { success: true, targetIndex: index };
      } catch (error) {
        console.error("Error during drop:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Touch-based drag and drop handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile && e.touches.length === 1 && e.touches[0]) {
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      isMobile &&
      touchStartY !== null &&
      e.touches.length === 1 &&
      e.touches[0]
    ) {
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;

      // If we've moved more than 10px vertically, consider it a drag
      if (Math.abs(deltaY) > 10 && !touchDragging) {
        setTouchDragging(true);
        setDragging(true, section.id);
        // Prevent default to stop viewport scrolling during drag
        e.preventDefault();
      }

      if (touchDragging) {
        // Prevent default to stop viewport scrolling during drag
        e.preventDefault();

        // Find the element under the touch point
        const touch = e.touches[0];

        // Check for auto-scrolling when near viewport edges
        handleAutoScroll(touch.clientY);

        const elementsAtPoint = document.elementsFromPoint(
          touch.clientX,
          touch.clientY
        );

        // Find the first draggable section element that isn't this one
        const targetSection = elementsAtPoint.find(
          (el) =>
            el.getAttribute("data-section-id") !== null &&
            el.getAttribute("data-section-id") !== section.id
        ) as Element | undefined;

        if (targetSection) {
          const sectionIndex = targetSection.getAttribute("data-section-index");
          const targetIndex =
            sectionIndex !== null ? parseInt(sectionIndex, 10) : -1;

          if (targetIndex >= 0 && targetIndex !== index) {
            reorderSections(index, targetIndex);
          }
        }
      }
    }
  };

  // Add passive: false to allow preventDefault() in touch handlers
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const preventDefaultTouch = (e: TouchEvent) => {
      if (touchDragging) {
        e.preventDefault();
      }
    };

    element.addEventListener("touchmove", preventDefaultTouch, {
      passive: false,
    });

    return () => {
      element.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, [touchDragging]);

  const handleTouchEnd = () => {
    if (isMobile) {
      setTouchStartY(null);
      if (touchDragging) {
        setTouchDragging(false);
        setDragging(false);

        // Clear any auto-scroll timers
        if (autoScrollTimerRef.current !== null) {
          window.clearInterval(autoScrollTimerRef.current);
          autoScrollTimerRef.current = null;
          setAutoScrolling(false);
        }
      }
    }
  };

  // Connect drag and drop refs
  drag(ref);
  drop(ref);
  preview(ref);

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(section.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(section.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(section.id);
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDelete(section.id);
    }
  };

  const containerClasses = [
    "relative group cursor-pointer rounded-lg overflow-hidden outline-none",
    "transition-all duration-300 ease-out",
    isSelected
      ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg transform scale-[1.02]"
      : "hover:ring-1 hover:ring-primary/50 hover:ring-offset-1 hover:ring-offset-background hover:shadow-md hover:transform hover:scale-[1.01]",
    "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
    isDragging || touchDragging ? "opacity-30 transform scale-95 blur-sm" : "",
    isOver && canDrop
      ? "ring-2 ring-blue-500 ring-offset-2 transform scale-[1.03]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const overlayClasses = [
    "absolute inset-0 pointer-events-none",
    "transition-all duration-300 ease-out",
    isSelected
      ? "bg-primary/8 border-2 border-primary opacity-100"
      : "bg-primary/0 border-2 border-transparent group-hover:bg-primary/3 group-hover:border-primary/20 opacity-0 group-hover:opacity-100",
    isDragging || touchDragging
      ? "bg-blue-500/10 border-2 border-blue-500/30"
      : "",
  ].join(" ");

  const selectionIndicatorClasses = [
    "absolute top-2 left-2 z-10 w-3 h-3 rounded-full",
    "transition-all duration-200 ease-out",
    isSelected
      ? "bg-primary shadow-lg scale-100 opacity-100"
      : "bg-primary/50 scale-75 opacity-0 group-hover:opacity-60 group-hover:scale-90",
  ].join(" ");

  return (
    <>
      {/* Drop zone indicator above */}
      {isOver && canDrop && (
        <div className="h-1 bg-blue-500 rounded-full mx-4 mb-2 transition-all duration-200" />
      )}

      <div
        ref={ref}
        className={containerClasses}
        onClick={handleSectionClick}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="button"
        aria-label={`Select ${section.type} section`}
        aria-pressed={isSelected}
        data-section-id={section.id}
        data-section-index={index}
        style={{
          opacity: isDragging || touchDragging ? 0.3 : 1,
          transform:
            isDragging || touchDragging
              ? "scale(0.95) rotate(1deg)"
              : undefined,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Selection overlay */}
        <div className={overlayClasses} />

        {/* Selection indicator */}
        <div className={selectionIndicatorClasses} />

        {/* Drag handle - desktop */}
        {!isMobile && (
          <div
            className={`
              absolute top-2 left-1/2 transform -translate-x-1/2 z-10 
              transition-all duration-200 ease-out
              ${
                isDragging
                  ? "opacity-100 scale-110"
                  : "opacity-0 group-hover:opacity-100 hover:scale-105"
              }
            `}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <div
              className={`
              bg-background/90 backdrop-blur-sm border rounded-md p-1 shadow-sm
              transition-all duration-200
              ${
                isDragging
                  ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/25"
                  : "hover:bg-primary/10 hover:border-primary/50"
              }
            `}
            >
              <GripVertical
                className={`
                w-4 h-4 transition-colors duration-200
                ${
                  isDragging
                    ? "text-blue-600"
                    : "text-muted-foreground hover:text-primary"
                }
              `}
              />
            </div>
          </div>
        )}

        {/* Drag handle - mobile */}
        {isMobile && (
          <div
            className={`
              absolute top-2 right-10 z-10 
              transition-all duration-200 ease-out
              ${touchDragging ? "opacity-100 scale-110" : "opacity-70"}
            `}
            style={{ touchAction: "none" }}
          >
            <div
              className={`
              bg-background/90 backdrop-blur-sm border rounded-full p-1.5 shadow-md
              transition-all duration-200
              ${
                touchDragging
                  ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/25"
                  : "border-primary/50"
              }
            `}
            >
              <Move
                className={`
                w-5 h-5 transition-colors duration-200
                ${touchDragging ? "text-blue-600" : "text-primary"}
              `}
              />
            </div>
          </div>
        )}

        {/* Delete button */}
        <button
          className={`
            absolute top-2 ${isMobile ? "right-2" : "right-2"} z-10 p-1.5 
            bg-destructive text-destructive-foreground rounded-full shadow-lg 
            hover:bg-destructive/90 hover:scale-110 focus:outline-none 
            focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-all duration-200
            ${isMobile ? "opacity-70" : ""}
          `}
          style={{
            transform: isSelected || isMobile ? "scale(1)" : "scale(0.9)",
            opacity: isSelected || isMobile ? 1 : 0,
          }}
          onClick={handleDeleteClick}
          title="Delete section"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Section content */}
        {children}
      </div>
    </>
  );
};

export default DraggableSection;
