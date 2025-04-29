import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  CardMedia
} from "@mui/material";
import AdminHeader from '../pages/AdminHeader';

function EditBlog() {
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    publishedDate: "",
    image: null,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/blogs/${id}`).then((res) => {
      const fetchedBlog = res.data.blog;
      setBlog({
        title: fetchedBlog.title,
        description: fetchedBlog.description,
        publishedDate: fetchedBlog.publishedDate,
        image: null,
      });
      setCurrentImage(fetchedBlog.image);
    });
  }, [id]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBlog({ ...blog, image: file });
    setUploadedFileName(file ? file.name : "");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("description", blog.description);
    formData.append("publishedDate", blog.publishedDate);
    if (blog.image) {
      formData.append("image", blog.image);
    }

    try {
      await axios.put(`http://localhost:5000/blogs/${id}`, formData);
      alert("Blog updated successfully!");
      navigate("/manage-blogs");
    } catch (error) {
      console.error(error);
      alert("Error updating blog.");
    }
  };

  return (
    <div  className="min-h-screen bg-gray-100">
      <AdminHeader />
    <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Blog
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={blog.title}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={blog.description}
          onChange={handleChange}
        />
        <TextField
          label="Published Date"
          name="publishedDate"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={blog.publishedDate}
          onChange={handleChange}
        />

        {/* Display existing image */}
        {currentImage && (
          <Box sx={{ my: 2, textAlign: "center" }}>
            <CardMedia
              component="img"
              image={`http://localhost:5000/${currentImage}`}
              alt="Current Blog"
              sx={{
                maxWidth: "100%",
                maxHeight: 300,
                borderRadius: 2,
                mx: "auto"
              }}
            />
          </Box>
        )}

        {/* Upload new image */}
        <Button
          variant="contained"
          component="label"
          sx={{
            my: 2,
            backgroundColor: "#6a1b9a",
            "&:hover": {
              backgroundColor: "#38006b",
            },
          }}
        >
          Upload New Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {/* Display file name*/}
        {uploadedFileName && (
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Selected file: {uploadedFileName}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#6a1b9a",
            "&:hover": {
              backgroundColor: "#38006b",
            },
          }}
        >
          Update Blog
        </Button>
      </Box>
    </Paper>
    </div>
  );
}

export default EditBlog;