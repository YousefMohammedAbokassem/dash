import { Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaceCard = ({ element, setDelete, setOpenDelete, setSelectedUpdate, setOpenUpdate }) => {
  const navigate = useNavigate();
  const handleDelete = () => {
    setDelete(element.id);
    setOpenDelete(true);
  };

  const handleUpdate = () => {
    setSelectedUpdate(element);
    setOpenUpdate(true);
  };
  return (
    // <Card sx={{ width: 345 }}>
    <Card sx={{ width: '100%' }}>
      <CardMedia sx={{ height: 300 }} image={element.images[0]?.path} title={element.name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Name:{' '}
          <Typography gutterBottom variant="h5" component="span" color={'warning.main'}>
            {element.name}
          </Typography>
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          Address:{' '}
          <Typography gutterBottom variant="h5" component="span" color={'warning.main'}>
            {element.address}
          </Typography>
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          Description:{' '}
          <Typography gutterBottom variant="h5" component="span" color={'warning.main'}>
            {element.description}
          </Typography>
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row">
          <Button size="small" onClick={handleUpdate} color="warning">
            Update
          </Button>
          <Button size="small" onClick={handleDelete} color="warning">
            Delete
          </Button>
        </Stack>
        <Stack>
          <Button
            size="small"
            color="warning"
            onClick={() => navigate(`/dashboard/map?lat=${element.location.lat}&lng=${element.location.lon}`)}
          >
            View Location
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default PlaceCard;
