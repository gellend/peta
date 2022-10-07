import * as React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'made with <3 by '}
      <Link color="inherit" href="https://gellen.page/">
        gellen
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}