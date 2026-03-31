import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6 bg-card/30 border border-dashed rounded-3xl"
    >
      <div className="relative h-48 w-48 md:h-64 md:w-64">
        <img 
          src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_db7117b4-1593-49e3-9760-1210535ebc8c.jpg" 
          alt="No tasks found" 
          className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal opacity-80"
        />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold tracking-tight">Your task list is empty</h3>
        <p className="text-muted-foreground text-sm">
          A clear head starts with a clear list. Add your first task above and start getting things done!
        </p>
      </div>
    </motion.div>
  );
};
