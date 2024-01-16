import {Alert, Button, ImageList, ImageListItem} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete.js";
import React from "react";

const TabThreeContent = ({
                             previewImages,
                             setPreviewImages,
                             existingImages,
                             setExistingImages,
                             newImages,
                             setNewImages,
                             setImagesToRemove,
                             handleFileChange,
                             imageError,
                             isNewParkingGarage,
                             parkingGarage,
                             handleSaveNewParkingGarage,
                             handleUpdateParkingGarage,
                             handleDeleteParkingGarage,
                             formValues,
                             imagesToRemove
                         }) => {
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setTimeout(() => {
            if (isNewParkingGarage) {
                handleSaveNewParkingGarage();
            } else {
                handleUpdateParkingGarage(formValues);
            }
        }, 0);
    };

    const imageListStyle = {
        height: '300px',
        overflowY: 'scroll',
        marginBottom: '20px'
    };

    const removeImage = (imageBlobUrl) => {
        const imageIndex = previewImages.findIndex(img => img === imageBlobUrl);

        const image = existingImages.find(img => img.blobUrl === imageBlobUrl);
        if (image) {
            setExistingImages(existingImages.filter(img => img.blobUrl !== imageBlobUrl));
            setImagesToRemove([...imagesToRemove, image.path]);
        }

        if (imageIndex !== -1) {
            setNewImages(newImages.filter((_, index) => index !== imageIndex));
            setPreviewImages(previewImages.filter((_, index) => index !== imageIndex));
        }
    };
    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <ImageList cols={6} gap={8} style={imageListStyle}>
                    {previewImages.map((imageSrc, index) => (
                        <ImageListItem key={index}>
                            <img
                                src={imageSrc}
                                alt={`Preview ${index}`}
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'scale-down'
                                }}
                            />
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => removeImage(imageSrc)}
                                style={{ position: 'absolute', top: 0, right: 0 }}
                            >
                                <DeleteIcon />
                            </Button>
                        </ImageListItem>
                    ))}
                </ImageList>
                <input
                    className="file-input"
                    accept="image/*"
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="raised-button-file" className="input-label">
                    <Button variant="contained" component="span" sx={{ mt: 2,
                        mb: 2,
                        backgroundColor: '#FF9000',
                        '&:hover': {
                            bgcolor: '#e80',
                        }
                        ,}} className="input-label-button">
                        Upload Image
                    </Button>
                </label>
                {imageError && (
                    <Alert severity="error">
                        {imageError}
                    </Alert>
                )}
                {!isNewParkingGarage && parkingGarage && (
                    <div className="crud-button-container">
                        <Button type="submit"
                                variant="contained"
                                sx={{
                                    width: 'max-content',
                                    margin: '5%',
                                    padding: "12px 20px",
                                    fontSize: "large",
                                    letterSpacing: "1px",
                                    textTransform: 'none',
                                    bgcolor: "#FF9000",
                                    '&:hover': {
                                        bgcolor: '#e80',
                                    },
                                    borderRadius: '10px',
                                    marginLeft: '5%',
                                }}>
                            Update parking garage
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleDeleteParkingGarage}
                            sx={{
                                width: 'max-content',
                                margin: '5%',
                                padding: "12px 20px",
                                fontSize: "large",
                                letterSpacing: "1px",
                                textTransform: 'none',
                                bgcolor: "#FF9000",
                                '&:hover': {
                                    bgcolor: '#e80',
                                },
                                borderRadius: '10px',
                                marginLeft: '5%',
                            }}
                        >
                            Delete parking garage
                        </Button>
                    </div>
                )}
                {isNewParkingGarage && (
                    <div className="crud-button-container">
                        <Button type="submit"
                                variant="contained"
                                sx={{
                                    width: 'max-content',
                                    margin: '5%',
                                    padding: "12px 20px",
                                    fontSize: "large",
                                    letterSpacing: "1px",
                                    textTransform: 'none',
                                    bgcolor: "#FF9000",
                                    '&:hover': {
                                        bgcolor: '#e80',
                                    },
                                    borderRadius: '10px',
                                    marginLeft: '5%',
                                }}>
                            Save new parking garage
                        </Button>
                    </div>
                )}
            </form>
        </div>
    )
};
TabThreeContent.displayName = 'TabThreeContent';
export default TabThreeContent;