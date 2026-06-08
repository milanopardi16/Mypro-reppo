import React from 'react'

const MOTION_PROPS = new Set([
  'initial', 'animate', 'transition', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileDragEnd',
  'whileInView', 'viewport', 'exit', 'layout', 'variants', 'custom', 'drag', 'dragConstraints', 'dragElastic',
  'dragMomentum', 'dragTransition', 'layoutId', 'onViewportBoxUpdate', 'style', 'onUpdate', 'whileDrag',
  'pointerEvents', 'transitionEnd', 'inherit', 'transformTemplate', 'features', 'onAnimationStart',
  'onAnimationComplete', 'onHoverStart', 'onHoverEnd', 'onTapStart', 'onTapCancel', 'onTap', 'onPan',
  'onPanStart', 'onPanEnd', 'onPanSession', 'onViewportBoxUpdate', 'onMeasure'
])

function cleanProps(props) {
  const result = {}
  for (const key in props) {
    if (MOTION_PROPS.has(key)) continue
    result[key] = props[key]
  }
  return result
}

function createMotionComponent(tag) {
  const MotionComponent = React.forwardRef(function MotionComponent(props, ref) {
    const { children, style, className, ...rest } = props
    return React.createElement(tag, { ref, style, className, ...cleanProps(rest) }, children)
  })
  MotionComponent.displayName = `NoMotion.${tag}`
  return MotionComponent
}

function AnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children)
}

function useScroll() {
  return { scrollYProgress: 0 }
}

function useTransform(value, inputRange, outputRange) {
  if (Array.isArray(outputRange)) {
    return outputRange[0]
  }
  return outputRange
}

function useInView() {
  return true
}

function useReducedMotion() {
  return true
}

const motion = new Proxy({}, {
  get(target, prop) {
    if (prop === '__esModule') return true
    if (prop === 'default') return motion
    if (prop === 'AnimatePresence') return AnimatePresence
    if (prop === 'useScroll') return useScroll
    if (prop === 'useTransform') return useTransform
    if (prop === 'useInView') return useInView
    if (prop === 'useReducedMotion') return useReducedMotion
    return createMotionComponent(prop)
  }
})

export { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion }
export default motion
