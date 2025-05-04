import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Container,
  Paper
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

function ViewBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/blogs").then((res) => {
      setBlogs(res.data.blogs);
      setFilteredBlogs(res.data.blogs);
    });
  }, []);

  // Handle search and filters
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterBlogs(query, dateFilter);
  };

  const handleDateFilter = (e) => {
    const selectedDate = e.target.value;
    setDateFilter(selectedDate);
    filterBlogs(search, selectedDate);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDateFilter("");
    setFilteredBlogs(blogs);
  };

  const filterBlogs = (searchQuery, dateQuery) => {
    const filtered = blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery) ||
        blog.description.toLowerCase().includes(searchQuery);

      const matchesDate = dateQuery
        ? new Date(blog.publishedDate).toLocaleDateString() ===
          new Date(dateQuery).toLocaleDateString()
        : true;

      return matchesSearch && matchesDate;
    });

    setFilteredBlogs(filtered);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/patterns/purplestripes.png')",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container>
        {/* Header with Icon */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <ArticleIcon sx={{ fontSize: 40, color: "#6a1b9a" }} />
          <Typography
            variant="h4"
            sx={{
              color: "#6a1b9a",
              fontWeight: "bold",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Our Latest Blogs
          </Typography>
        </Stack>

        {/* Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearch}
            sx={{
              width: 250,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 1,
            }}
          />
          <TextField
            type="date"
            label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            value={dateFilter}
            onChange={handleDateFilter}
            sx={{
              width: 200,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 1,
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6a1b9a",
              ":hover": { backgroundColor: "#38006b" },
              width: 150,
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </Stack>

        {/* Blog List */}
        {filteredBlogs.length === 0 ? (
          <Typography align="center" variant="h6" sx={{ color: "#6a1b9a" }}>
            No blogs found.
          </Typography>
        ) : (
          filteredBlogs.map((blog) => (
            <Card
              key={blog._id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                mb: 3,
                px: 3,
                py: 2,
                boxShadow: 5,
                borderRadius: 3,
                maxWidth: "120%",
                mx: "auto",
                backgroundColor: "#ffffff",
                "&:hover": {
                  boxShadow: 8,
                  transform: "scale(1.02)",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              <CardMedia
                component="img"
                image={`http://localhost:5000/${blog.image}`}
                alt={blog.title}
                sx={{
                  width: 450,
                  height: "auto",
                  borderRadius: 2,
                  mr: { sm: 2 },
                  mb: { xs: 2, sm: 0 },
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#6a1b9a",
                    mb: 1,
                    fontWeight: "bold",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  {blog.title}
                </Typography>
                <Paper
                  component="blockquote"
                  elevation={0}
                  sx={{
                    borderLeft: "5px solid #6a1b9a",
                    paddingLeft: 2,
                    fontStyle: "italic",
                    fontSize: "1rem",
                    color: "#333",
                    backgroundColor: "transparent",
                    mb: 1,
                  }}
                >
                  {blog.description}
                </Paper>
                <Typography variant="body2" sx={{ color: "#888" }}>
                  {new Date(blog.publishedDate).toDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}

        {/* Bottom Description */}
        <Box
          sx={{
            mt: 8,
            py: 6,
            px: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)",
            borderRadius: 4,
            boxShadow: 3,
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#6a1b9a",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Capturing Moments, One Blog at a Time
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 750,
                color: "#4a148c",
                fontSize: "1.15rem",
                fontFamily: "'Open Sans', sans-serif",
                lineHeight: 1.8,
                fontStyle: "italic",
                paddingLeft: "30px",
                borderLeft: "5px solid #6a1b9a",
                marginTop: "20px",
              }}
            >
              At <strong>Lavendra Photography</strong>, every story we share is more than just a memory — it's a moment frozen in time. Our blogs showcase unforgettable events, magical weddings, and heartfelt journeys captured through our lens. Whether you're planning your special day or looking for inspiration, these stories reflect the <em>passion, creativity</em>, and care we bring to every frame. <strong>Let your story be the next we tell.</strong>
            </Typography>

            {/* Photo Collection */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: "center", mt: 4 }}>
              {["blog_img1.jpg", "blog_img2.jpg", "blog_img3.jpg", "blog_img4.jpg"].map((image, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 200,
                    height: 200,
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: 8,
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease-in-out",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`/images/${image}`}
                    alt={`Image ${index + 1}`}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Card>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default ViewBlogs;