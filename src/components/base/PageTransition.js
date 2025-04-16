'use client'

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import FrozenRoute from "./FrozenRoute";

const PageTransition = ({ children }) => {
  const pathname = usePathname()

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div key={pathname} className="w-full h-full">
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition