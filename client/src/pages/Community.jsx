import { useState } from "react";
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import { communityService } from "../services/api";

// Sample community posts
const samplePosts = [
  {
    id: 1,
    title: "Dealing with Work Stress",
    content: "What are your best strategies for managing work-related stress?",
    author: "Anonymous",
    likes: 15,
    comments: 5,
  },
  {
    id: 2,
    title: "Meditation Success Story",
    content: "After 30 days of consistent meditation, here's what changed...",
    author: "Anonymous",
    likes: 23,
    comments: 8,
  },
];

function Community() {
  const [posts, setPosts] = useState(samplePosts);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const post = {
        id: posts.length + 1,
        ...newPost,
        author: "Anonymous",
        likes: 0,
        comments: 0,
      };

      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "" });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Community Support
      </h1>

      <Card className="mb-6">
        <CardBody className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter your post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            label="Content"
            placeholder="Share your thoughts..."
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />
          <Button color="primary" onPress={handleCreatePost}>
            Create Post
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardBody>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.content}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{post.author}</span>
                <div className="space-x-4">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Community;
