"use client";

import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDragLayer } from "react-dnd";

import { useBuilderStore } from "@/stores/builder-store";
import DragPreview from "./DragPreview";

interface DragDropProviderProps {
  children: React.ReactNode;
}

const CustomDragLayer: React.FC = () => {
  const { getSectionById } = useBuilderStore();

  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  if (!isDragging || itemType !== "SECTION") {
    return null;
  }

  const section = getSectionById(item?.id);
  if (!section) {
    return null;
  }

  const layerStyles: React.CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  };

  const getItemStyles = (
    initialOffset: { x: number; y: number } | null,
    currentOffset: { x: number; y: number } | null
  ): React.CSSProperties => {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }

    const { x, y } = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  };

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <DragPreview section={section} />
      </div>
    </div>
  );
};

const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const { cancelDrag } = useBuilderStore();

  // Add global touch event handlers to reset drag state
  useEffect(() => {
    // Function to handle unexpected touch end or cancellation
    const handleGlobalTouchEnd = () => {
      // Reset any stuck dragging state
      cancelDrag();
    };

    // Add event listeners to document
    document.addEventListener("touchend", handleGlobalTouchEnd, {
      passive: true,
    });
    document.addEventListener("touchcancel", handleGlobalTouchEnd, {
      passive: true,
    });

    // Cleanup
    return () => {
      document.removeEventListener("touchend", handleGlobalTouchEnd);
      document.removeEventListener("touchcancel", handleGlobalTouchEnd);
    };
  }, [cancelDrag]);

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      {children}
    </DndProvider>
  );
};

export default DragDropProvider;
