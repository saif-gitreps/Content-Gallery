import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";
import { Input, Button, Select } from "../index";
import getCroppedImg from "./CropImage";

const ImageCropModal = ({ setToggleModal, imageSrc, setImageSrc }) => {
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [rotation, setRotation] = useState(0);
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
   const [aspectRatio, setAspectRatio] = useState();

   const onCropComplete = (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
   };

   const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (e) => {
            setImageSrc(e.target.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const cropAndSave = async () => {
      try {
         const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
         setImageSrc(croppedImage);
         setToggleModal(false);
      } catch (e) {
         console.error(e);
      }
   };

   return (
      <div className="fixed inset-0 z-50 mt-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20">
         <div className="relative w-11/12 max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <button
               onClick={() => setToggleModal(false)}
               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
               <X size={24} />
            </button>

            <Input
               label="Choose an image:"
               type="file"
               onChange={handleFileChange}
               className="mb-4"
            />

            <div className="relative h-64 mb-4">
               <Cropper
                  image={imageSrc}
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
               />
            </div>
            <Input
               type="range"
               label="Set zoom:"
               value={zoom}
               min={1}
               max={3}
               step={0.1}
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               className="mb-4"
            />
            <Input
               type="range"
               label="Set rotation:"
               value={rotation}
               min={0}
               max={360}
               onChange={(e) => setRotation(parseInt(e.target.value))}
               className="mb-4"
            />
            <Select
               label="Aspect Ratio:"
               options={[18 / 9, 16 / 9, 4 / 3, 4 / 4, 9 / 10, 9 / 16, 9 / 18]}
               className="mb-4"
               onChange={(e) => setAspectRatio(parseFloat(e.target.value))}
            />
            <Button onClick={cropAndSave} text="Crop and save" className="w-full" />
         </div>
      </div>
   );
};

export default ImageCropModal;
