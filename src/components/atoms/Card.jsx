import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'default',
  ...props 
}) => {
  const baseClasses = "bg-white rounded-lg border border-gray-200 shadow-sm"
  const hoverClasses = hover ? "hover:shadow-md transition-shadow duration-200" : ""
  
  const paddingClasses = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  }
  
return (
    <motion.div
      whileHover={hover ? { y: -3, scale: 1.02 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        ${baseClasses}
        ${hoverClasses}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card