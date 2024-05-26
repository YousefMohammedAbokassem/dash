import { Skeleton } from '@mui/material';
import React from 'react';

const SkeletonCopm = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <Skeleton key={index} variant="rectangular" width={'100%'} height={450} sx={{ borderRadius: '10px' }} />
      ))}
    </>
  );
};

export default SkeletonCopm;
