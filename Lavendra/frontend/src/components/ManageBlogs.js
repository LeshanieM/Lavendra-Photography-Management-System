import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminHeader from '../pages/AdminHeader';

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Button,
  CardMedia,
  styled
} from "@mui/material";

const StyledTableHeadCell = styled(TableCell)({
  backgroundColor: "#798095",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  border: "1px solid #ddd",
});

const StyledTableCell = styled(TableCell)({
  border: "1px solid #ddd",
  padding: "12px",
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: "40px",
  height: "40px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  color: "#fff",
  margin: "5px",
  "&.edit": {
    backgroundColor: "#3057cc",
    "&:hover": {
      backgroundColor: "#2647a6",
    },
  },
  "&.delete": {
    backgroundColor: "#DC3545",
    "&:hover": {
      backgroundColor: "#c82333",
    },
  },
}));

const ViewButton = styled(Button)({
  backgroundColor: "#3057cc",
  color: "white",
  textTransform: "none",
  padding: "6px 16px",
  borderRadius: "8px",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#2647a6",
  },
});

function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);

 // Fetch all blogs from the server
  useEffect(() => {
    axios.get("http://localhost:5000/blogs").then((res) => setBlogs(res.data.blogs));
  }, []);

  // Handle blog deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await axios.delete(`http://localhost:5000/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    }
  };

  return (
    <div  className="min-h-screen bg-gray-100">
      <AdminHeader />
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 2,
      }}
    >
      {/* Title and Buttons */}
      <Box
        sx={{
          width: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Manage Blogs
        </Typography>

        <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          <Link to="/add-blog">
            <ViewButton variant="contained">Add New Blog</ViewButton>
          </Link>
          <Link to="/view-blogs">
            <ViewButton variant="contained">View Blog Page</ViewButton>
          </Link>
        </Box>
      </Box>

      {/* Blog Table */}
      <Box sx={{ overflowX: "auto", maxWidth: "90vw" }}>
        <Table sx={{ minWidth: 1000, borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Title</StyledTableHeadCell>
              <StyledTableHeadCell>Image</StyledTableHeadCell>
              <StyledTableHeadCell>Description</StyledTableHeadCell>
              <StyledTableHeadCell>Date</StyledTableHeadCell>
              <StyledTableHeadCell>Actions</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id} sx={{ "&:nth-of-type(even)": { backgroundColor: "#f2f2f2" } }}>
                <StyledTableCell>{blog.title}</StyledTableCell>
                <StyledTableCell>
                  <CardMedia
                    component="img"
                    image={`http://localhost:5000/${blog.image}`}
                    alt={blog.title}
                    sx={{ width: 100, borderRadius: 2 }}
                  />
                </StyledTableCell>
                <StyledTableCell>{blog.description}</StyledTableCell>
                <StyledTableCell>{new Date(blog.publishedDate).toDateString()}</StyledTableCell>
                <StyledTableCell>
                  <Link to={`/edit-blog/${blog._id}`}>
                    <StyledIconButton className="edit">
                      <FaEdit />
                    </StyledIconButton>
                  </Link>
                  <StyledIconButton className="delete" onClick={() => handleDelete(blog._id)}>
                    <FaTrash />
                  </StyledIconButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
    </div>
  );
}

export default ManageBlogs;