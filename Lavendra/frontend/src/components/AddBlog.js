import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Stack,
} from "@mui/material";
import AdminHeader from '../pages/AdminHeader';

function AddBlog() {
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    publishedDate: "",
    image: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const isValidDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate <= today;
  };

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setBlog({ ...blog, image: e.target.files[0] });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidDate(blog.publishedDate)) {
      setErrorMessage("Published date cannot be in the future.");  // Validate not to get future dates
      return;
    }

    if (!blog.image) {
      setErrorMessage("Image is required to add a blog.");
      return;
    }

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("description", blog.description);
    formData.append("publishedDate", blog.publishedDate);
    formData.append("image", blog.image);

    try {
      await axios.post("http://localhost:5000/blogs", formData);
      alert("Blog added successfully!");
      navigate("/manage-blogs");
    } catch (error) {
      console.error(error);
      setErrorMessage("There was an error adding the blog.");
    }
  };

  const handleReset = () => {
    setBlog({
      title: "",
      description: "",
      publishedDate: "",
      image: null,
    });
    setErrorMessage("");
  };

  return (
    <div  className="min-h-screen bg-gray-100">
      <AdminHeader />
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/images/blog_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper elevation={5} sx={{ 
        maxWidth: 600, 
        width: "100%", 
        p: 4, 
        backdropFilter: "blur(5px)", 
        backgroundColor: "rgba(255,255,255,0.85)" 
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Blog
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={blog.title}
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={blog.description}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            label="Published Date"
            name="publishedDate"
            value={blog.publishedDate}
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            required
          />

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
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {blog.image && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {blog.image.name}
            </Typography>
          )}

          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Stack spacing={2} direction="row" justifyContent="space-between">
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#6a1b9a",
                "&:hover": {
                  backgroundColor: "#38006b",
                },
                flex: 1,
              }}
            >
              Add Blog
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{
                flex: 1,
                "&:focus": {
                  outline: "none",
                },
                "&:active": {
                  backgroundColor: "transparent",
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
    </div>
  );
}

export default AddBlog;