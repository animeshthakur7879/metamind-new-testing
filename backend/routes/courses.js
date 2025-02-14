// routes/courses.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// --- Your functions to fetch courses from YouTube, Coursera, and playlists --- //
async function fetchYouTubeCourses(skill) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${skill}+course&type=video&key=${YOUTUBE_API_KEY}&maxResults=10`
    );
    return response.data.items.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description || "No description available.",
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      source: 'YouTube',
      price: 'Free',
      level: 'Beginner',
      reviews: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      certificate: 'No Certificate',
      youtubePlaylist: false
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

async function fetchYouTubePlaylists(skill) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${skill}+course&key=${YOUTUBE_API_KEY}&type=playlist&maxResults=5`
    );
    return response.data.items.map(playlist => ({
      id: playlist.id.playlistId,
      title: playlist.snippet.title,
      description: playlist.snippet.description || "No description available.",
      url: `https://www.youtube.com/playlist?list=${playlist.id.playlistId}`,
      source: 'YouTube Playlist',
      price: 'Free',
      level: 'Beginner',
      reviews: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      certificate: 'No Certificate',
      youtubePlaylist: true
    }));
  } catch (error) {
    console.error('YouTube Playlist API error:', error);
    return [];
  }
}

async function fetchCourseraCourses(skill) {
  try {
    const response = await axios.get(
      `https://www.coursera.org/api/courses.v1?q=search&query=${skill}`
    );
    return response.data.elements.map(course => ({
      id: course.id,
      title: course.name,
      description: course.description || "No description available.",
      url: `https://www.coursera.org/learn/${course.slug}`,
      source: 'Coursera',
      price: Math.random() < 0.5 ? 'Free' : 'Paid',
      level: ['Beginner', 'Intermediate', 'Expert'][Math.floor(Math.random() * 3)],
      reviews: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
      certificate: Math.random() < 0.7 ? 'Provides Certificate' : 'No Certificate',
      youtubePlaylist: false
    }));
  } catch (error) {
    console.error('Coursera API error:', error);
    return [];
  }
}

// API endpoint to fetch all courses
router.get('/', async (req, res) => {
  const { skill, price, level, certificate, youtubePlaylist } = req.query;
  if (!skill) return res.status(400).json({ error: 'Skill query is required' });

  try {
    const youtubeCourses = await fetchYouTubeCourses(skill);
    const courseraCourses = await fetchCourseraCourses(skill);
    const youtubePlaylists = await fetchYouTubePlaylists(skill);
    let allCourses = [...youtubeCourses, ...courseraCourses, ...youtubePlaylists];

    // Apply filters if provided
    if (price && price !== "All") {
      allCourses = allCourses.filter(course => course.price.toLowerCase() === price.toLowerCase());
    }
    if (level && level !== "All") {
      allCourses = allCourses.filter(course => course.level.toLowerCase() === level.toLowerCase());
    }
    if (certificate && certificate !== "All") {
      allCourses = allCourses.filter(course => course.certificate.toLowerCase() === certificate.toLowerCase());
    }
    if (youtubePlaylist && youtubePlaylist === "true") {
      allCourses = allCourses.filter(course => course.youtubePlaylist === true);
    }

    // Sort courses by reviews descending
    allCourses.sort((a, b) => b.reviews - a.reviews);

    console.log(`Fetched ${allCourses.length} courses for skill: ${skill}`);
    res.json({ courses: allCourses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;
