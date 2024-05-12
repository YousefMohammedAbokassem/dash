import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';
  import { useSelector } from 'react-redux';
import React, {useRef, useState} from 'react';
  
  
  export const AccountProfile = ({selectedFile, setSelectedFile}) => {

    const {eshoppingadmin} = useSelector(state => state.auth)

    const [showFile, setShowFile] = useState(null)

    
    const fileInputRef  = useRef(null)

    const handleUploadButtonClick = () => {
        fileInputRef.current.click();
      };


    
    const handleFileInputChange = (event) => {
        setSelectedFile(event.target.files[0])
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setShowFile(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
            setShowFile(null);
        }
      };
    
    return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={showFile ? showFile :  `${process.env.REACT_APP_API_URL_IMAGE}${eshoppingadmin.image}`}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {`${eshoppingadmin.first_name} ${eshoppingadmin.last_name}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <div style={{margin: "auto"}}>
            <label htmlFor='upload_picture' >
                <Button
                fullWidth
                variant="text"
                onClick={handleUploadButtonClick}
                >
                Upload picture
                </Button>
            </label>
            <input type='file' id='upload_picture' style={{display: "none"}} ref={fileInputRef} onChange={handleFileInputChange}/>
        </div>
      </CardActions>
    </Card>
  )};