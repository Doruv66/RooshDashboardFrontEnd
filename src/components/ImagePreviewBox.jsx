import {Box} from "@mui/material";

function ImagePreviewBox({ imageSrc }) {
    return <Box
        sx={{
            width: '15rem',
            height: '15rem',
            backgroundColor: '#E0E0E0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            overflow: 'hidden',
            borderRadius: '4px',
        }}
    >
        <img
            src={imageSrc}
            alt="Preview"
            style={{
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'block',
            }}
        />
    </Box>
}
export default ImagePreviewBox;