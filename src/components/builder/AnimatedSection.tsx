"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Section } from "@/types";
import DraggableSection from "./DraggableSection";

interface AnimatedSectionProps {
  section: Section;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

const sectionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    y: -2,
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

export function AnimatedSection({
  section,
  index,
  isSelected,
  onSelect,
  onDelete,
  children,
}: AnimatedSectionProps) {
  return (
    <motion.div
      key={section.id}
      layout
      layoutId={section.id}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={sectionVariants}
      transition={{
        layout: {
          type: "spring",
          bounce: 0.2,
          duration: 0.6,
        },
      }}
    >
      <DraggableSection
        section={section}
        index={index}
        isSelected={isSelected}
        onSelect={onSelect}
        onDelete={onDelete}
      >
        {children}
      </DraggableSection>
    </motion.div>
  );
}
