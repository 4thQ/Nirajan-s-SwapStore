/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { ErrorMessage } from "formik";
import { DeleteSVG, UploadSVG } from "../icons";

const ImageUpload = ({ field, form, setFieldValue, existingImages = [] }) => {
  const [imagePreviews, setImagePreviews] = useState(existingImages);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [newImagePreviews]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setFieldValue(field.name, [...form.values.images, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const removeImage = (index, isNewImage = false) => {
    if (isNewImage) {
      const updatedFiles = form.values.images.filter((_, i) => i !== index);
      setFieldValue("images", updatedFiles);

      const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
      setNewImagePreviews(updatedPreviews);
    } else {
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(updatedPreviews);

      const removedImages = form.values.removedImages || [];
      removedImages.push(existingImages[index]);
      setFieldValue("removedImages", removedImages);
    }
  };

  return (
    <div className="custom-image-upload">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
        id="images"
      />
      <label
        htmlFor="images"
        className="border border-gray-400 w-64 p-4 rounded items-center gap-4 flex overflow-hidden cursor-pointer"
      >
        <div>
          <UploadSVG />
        </div>{" "}
        Upload Images
      </label>
      <ErrorMessage name={field.name} component="div" className="text-red-600 text-sm" />

      <div className="image-preview-container mt-4 flex flex-wrap gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="image-preview relative">
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="h-24 w-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 mt-0 mr-0 w-8 flex justify-center items-center h-8 bg-primary rounded "
            >
              <DeleteSVG />
            </button>
          </div>
        ))}

        {newImagePreviews.map((preview, index) => (
          <div key={index} className="image-preview relative">
            <img
              src={preview}
              alt={`New Preview ${index}`}
              className="h-24 w-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index, true)}
              className="absolute top-0 right-0 mt-0 mr-0 w-8 flex justify-center items-center h-8 bg-primary rounded "
            >
              <DeleteSVG />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
