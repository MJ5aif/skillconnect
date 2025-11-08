import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaCommentDots, 
  FaShare, 
  FaImage, 
  FaTimes, 
  FaVideo,
  FaUserTie,
  FaUserGraduate,
  FaThumbsUp,
  FaLightbulb,
  FaSadTear,
  FaHandHoldingHeart,
  FaPlus
} from 'react-icons/fa';

const CommunityFeed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [activeView, setActiveView] = useState('feed'); // 'feed', 'network', 'tags'
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showReactionMenu, setShowReactionMenu] = useState(null);
  const [showPostWizard, setShowPostWizard] = useState(null);
  const [wizardData, setWizardData] = useState({
    title: '',
    content: '',
    skills: [],
    newSkill: '',
    budget: '',
    level: 'Beginner'
  });

  // Mock current user
  const currentUser = {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=200&background=0D8ABC&color=fff',
    headline: 'MERN Stack Mentor & Web Developer'
  };

  // Reaction types
  const reactionTypes = [
    { type: 'like', icon: FaThumbsUp, label: 'Like', color: 'text-blue-600' },
    { type: 'love', icon: FaHeart, label: 'Love', color: 'text-red-500' },
    { type: 'insightful', icon: FaLightbulb, label: 'Insightful', color: 'text-yellow-500' },
    { type: 'care', icon: FaHandHoldingHeart, label: 'Care', color: 'text-pink-500' },
    { type: 'sad', icon: FaSadTear, label: 'Sad', color: 'text-gray-600' }
  ];

  // New members
  const newMembers = [
    { id: 1, userId: 'teacher-123', userType: 'teacher', name: 'Alex Turner', headline: 'React Enthusiast', avatar: 'https://ui-avatars.com/api/?name=Alex+Turner&size=100&background=F59E0B&color=fff' },
    { id: 2, userId: 'student-456', userType: 'student', name: 'Lisa Wang', headline: 'Data Science Student', avatar: 'https://ui-avatars.com/api/?name=Lisa+Wang&size=100&background=EC4899&color=fff' },
    { id: 3, userId: 'teacher-789', userType: 'teacher', name: 'Tom Harris', headline: 'Backend Developer', avatar: 'https://ui-avatars.com/api/?name=Tom+Harris&size=100&background=6366F1&color=fff' }
  ];

  // Trending topics
  const trendingTopics = [
    { tag: '#JavaScript', count: 1234 },
    { tag: '#ReactJS', count: 987 },
    { tag: '#WebDevelopment', count: 856 },
    { tag: '#NodeJS', count: 745 },
    { tag: '#CareerAdvice', count: 623 },
    { tag: '#WebRTC', count: 412 }
  ];

  // Network connections - mock data for My Network view
  const networkConnections = [
    {
      id: 'conn-1',
      userId: 'teacher-456',
      name: 'Jennifer Martinez',
      avatar: 'https://ui-avatars.com/api/?name=Jennifer+Martinez&size=100&background=10B981&color=fff',
      headline: 'Full-Stack Developer & Mentor',
      mutualConnections: 12,
      userType: 'teacher'
    },
    {
      id: 'conn-2',
      userId: 'teacher-789',
      name: 'Robert Chen',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Chen&size=100&background=3B82F6&color=fff',
      headline: 'Data Science Instructor',
      mutualConnections: 8,
      userType: 'teacher'
    },
    {
      id: 'conn-3',
      userId: 'student-123',
      name: 'Amanda Wilson',
      avatar: 'https://ui-avatars.com/api/?name=Amanda+Wilson&size=100&background=EC4899&color=fff',
      headline: 'Frontend Developer Student',
      mutualConnections: 5,
      userType: 'student'
    },
    {
      id: 'conn-4',
      userId: 'teacher-321',
      name: 'David Kumar',
      avatar: 'https://ui-avatars.com/api/?name=David+Kumar&size=100&background=F59E0B&color=fff',
      headline: 'Python & AI Expert',
      mutualConnections: 15,
      userType: 'teacher'
    },
    {
      id: 'conn-5',
      userId: 'student-654',
      name: 'Sophie Taylor',
      avatar: 'https://ui-avatars.com/api/?name=Sophie+Taylor&size=100&background=8B5CF6&color=fff',
      headline: 'UX/UI Design Student',
      mutualConnections: 7,
      userType: 'student'
    }
  ];

  // Load mock posts
  useEffect(() => {
    const mockPosts = [
      {
        id: 'post-1',
        type: 'regular',
        author: {
          id: 'user-2',
          name: 'Sarah Johnson',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=100&background=10B981&color=fff',
          headline: 'Python & AI Expert'
        },
        content: 'Just published a new course on Machine Learning fundamentals! Excited to help more students master AI concepts. #MachineLearning #Python #AI',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reactions: { like: ['user-3', 'user-4'], love: ['user-5'], insightful: ['user-1'] },
        comments: [
          {
            id: 'comment-1',
            author: { name: 'Mike Chen', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&size=50&background=3B82F6&color=fff' },
            content: 'Congratulations! Looking forward to checking it out.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'post-2',
        type: 'job_teacher',
        author: {
          id: 'user-3',
          name: 'Mike Chen',
          avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&size=100&background=3B82F6&color=fff',
          headline: 'Full-Stack Developer'
        },
        title: 'Need Help with React Project',
        content: 'Looking for an experienced React developer to help me build a real-time dashboard with WebSockets and charts.',
        skills: ['React', 'WebSockets', 'D3.js', 'Node.js'],
        budget: '$50 flat fee',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        reactions: { like: ['user-1', 'user-2'], care: ['user-4'] },
        comments: []
      },
      {
        id: 'post-3',
        type: 'regular',
        author: {
          id: 'user-4',
          name: 'Emily Davis',
          avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&size=100&background=8B5CF6&color=fff',
          headline: 'UX/UI Designer'
        },
        content: "What are your favorite design tools in 2025? I've been using Figma exclusively but curious about the new AI-powered alternatives. #Design #UX #UI",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        reactions: { like: ['user-1', 'user-2', 'user-3'], love: ['user-5'] },
        comments: [
          {
            id: 'comment-2',
            author: { name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=50&background=10B981&color=fff' },
            content: 'Still love Figma! But also exploring Framer for prototyping.',
            timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'post-4',
        type: 'job_student',
        author: {
          id: 'user-5',
          name: 'Alex Turner',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Turner&size=100&background=F59E0B&color=fff',
          headline: 'React Enthusiast'
        },
        title: 'Want to Learn Advanced TypeScript',
        content: 'I have basic TypeScript knowledge but want to master advanced patterns like generics, decorators, and type guards.',
        skills: ['TypeScript', 'Advanced Patterns', 'Type Safety'],
        budget: '$25/hr',
        level: 'Intermediate',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        reactions: { like: ['user-2'], insightful: ['user-3'] },
        comments: []
      },
      {
        id: 'post-5',
        type: 'regular',
        author: {
          id: 'user-6',
          name: 'David Kim',
          avatar: 'https://ui-avatars.com/api/?name=David+Kim&size=100&background=EF4444&color=fff',
          headline: 'DevOps Engineer'
        },
        content: 'Just deployed my first Kubernetes cluster on AWS! The learning curve was steep but totally worth it. Happy to answer questions for anyone getting started. #DevOps #Kubernetes #AWS #CloudComputing',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        reactions: { like: ['user-1', 'user-3', 'user-4'], love: ['user-2'], insightful: ['user-5'] },
        comments: [
          {
            id: 'comment-3',
            author: { name: 'Mike Chen', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&size=50&background=3B82F6&color=fff' },
            content: 'Congrats! How long did it take you to get comfortable with kubectl?',
            timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'comment-4',
            author: { name: 'Emily Davis', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&size=50&background=8B5CF6&color=fff' },
            content: 'This is amazing! Would you recommend any specific courses?',
            timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'post-6',
        type: 'regular',
        author: {
          id: 'user-7',
          name: 'Lisa Wang',
          avatar: 'https://ui-avatars.com/api/?name=Lisa+Wang&size=100&background=EC4899&color=fff',
          headline: 'Data Science Student'
        },
        content: "Completed my first data visualization project using D3.js! Creating interactive charts is so rewarding. Here's what I learned about storytelling with data. #DataScience #D3js #Visualization",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        reactions: { like: ['user-1', 'user-2'], love: ['user-3'], insightful: ['user-4', 'user-5'] },
        comments: []
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setNewPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && !newPostImage) {
      alert('Please add some content or an image');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      type: 'regular',
      author: currentUser,
      content: newPostContent,
      image: imagePreview,
      timestamp: new Date().toISOString(),
      reactions: {},
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImage(null);
    setImagePreview(null);
  };

  const handleReaction = (postId, reactionType) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const reactions = { ...post.reactions };
        const userReactions = reactions[reactionType] || [];
        const hasReacted = userReactions.includes(currentUser.id);

        if (hasReacted) {
          reactions[reactionType] = userReactions.filter(id => id !== currentUser.id);
        } else {
          // Remove user from other reactions
          Object.keys(reactions).forEach(key => {
            reactions[key] = reactions[key].filter(id => id !== currentUser.id);
          });
          reactions[reactionType] = [...userReactions, currentUser.id];
        }

        return { ...post, reactions };
      }
      return post;
    }));
    setShowReactionMenu(null);
  };

  const getUserReaction = (post) => {
    for (const [type, users] of Object.entries(post.reactions || {})) {
      if (users.includes(currentUser.id)) {
        return reactionTypes.find(r => r.type === type);
      }
    }
    return null;
  };

  const getTotalReactions = (post) => {
    return Object.values(post.reactions || {}).reduce((total, users) => total + users.length, 0);
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment-${Date.now()}`,
              author: {
                name: currentUser.name,
                avatar: currentUser.avatar
              },
              content: commentText,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreateJobPost = () => {
    if (!wizardData.title || !wizardData.content || !wizardData.budget) {
      alert('Please fill all required fields');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      type: showPostWizard,
      author: currentUser,
      title: wizardData.title,
      content: wizardData.content,
      skills: wizardData.skills,
      budget: wizardData.budget,
      level: wizardData.level,
      timestamp: new Date().toISOString(),
      reactions: {},
      comments: []
    };

    setPosts([newPost, ...posts]);
    setShowPostWizard(null);
    setWizardData({ title: '', content: '', skills: [], newSkill: '', budget: '', level: 'Beginner' });
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8">
              {/* User Card with Gradient Banner */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="h-24 bg-gradient-to-r from-blue-200 to-teal-100"></div>
                <div className="px-6 pb-6">
                  <div className="-mt-12 mb-4 flex justify-center">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1 text-center">{currentUser.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">{currentUser.headline}</p>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Profile views</span>
                      <span className="font-semibold text-blue-600">128</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Connections</span>
                      <span className="font-semibold text-blue-600">342</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Nav */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveView('feed')}
                    className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeView === 'feed'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    My Feed
                  </button>
                  <button
                    onClick={() => setActiveView('network')}
                    className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeView === 'network'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    My Network
                  </button>
                  <button
                    onClick={() => setActiveView('tags')}
                    className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeView === 'tags'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Trending Tags
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex gap-3 mb-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300"
                  rows={3}
                />
              </div>
              
              {imagePreview && (
                <div className="relative mb-3">
                  <img src={imagePreview} alt="Preview" className="rounded-lg max-h-64 w-full object-cover" />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setNewPostImage(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-gray-800/70 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex gap-3">
                  <label className="cursor-pointer text-gray-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50">
                    <FaImage className="text-xl" />
                    <span className="text-sm font-medium">Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  <button className="text-gray-600 hover:text-teal-600 transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-50">
                    <FaVideo className="text-xl" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPostWizard('job_teacher')}
                    className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 hover:from-teal-100 hover:to-teal-200 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <FaUserTie />
                    Look for Student
                  </button>
                  <button
                    onClick={() => setShowPostWizard('job_student')}
                    className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <FaUserGraduate />
                    Look for Teacher
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* My Feed View - Posts List */}
            {activeView === 'feed' && (
              <div className="space-y-6">
                {posts.map((post) => {
                const userReaction = getUserReaction(post);
                const totalReactions = getTotalReactions(post);
                const commentsExpanded = expandedComments[post.id];

                return (
                  <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    {/* Post Header */}
                    <div className="p-4 flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{post.author.name}</h4>
                        <p className="text-sm text-gray-600">{post.author.headline}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                      </div>
                    </div>

                    {/* Job Post Card */}
                    {(post.type === 'job_teacher' || post.type === 'job_student') && (
                      <div className="px-4 pb-4">
                        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-100">
                          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 font-medium rounded-full text-sm mb-3">
                            {post.type === 'job_teacher' ? 'LOOKING FOR A STUDENT' : 'LOOKING FOR A TEACHER'}
                          </span>
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
                          <p className="text-gray-700 mb-4">{post.content}</p>
                          {post.level && (
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-semibold">Level:</span> {post.level}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.skills?.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-gray-700">{post.budget}</p>
                            <button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                              View Details & Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Regular Post Content */}
                    {post.type === 'regular' && (
                      <>
                        <div className="px-4 pb-3">
                          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                        </div>
                        {post.image && (
                          <img src={post.image} alt="Post" className="w-full max-h-96 object-cover" />
                        )}
                      </>
                    )}

                    {/* Post Footer */}
                    <div className="px-4 py-3 border-t border-gray-100">
                      <div className="flex items-center justify-around">
                        {/* Reactions */}
                        <div className="relative">
                          <button
                            onClick={() => setShowReactionMenu(showReactionMenu === post.id ? null : post.id)}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-blue-50 group"
                          >
                            {userReaction ? (
                              <>
                                <userReaction.icon className={`text-xl ${userReaction.color} scale-110 transition-transform duration-300`} />
                                <span className={`text-sm font-medium ${userReaction.color}`}>
                                  {userReaction.label}
                                </span>
                              </>
                            ) : (
                              <>
                                <FaThumbsUp className="text-xl group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-sm font-medium">React</span>
                              </>
                            )}
                            {totalReactions > 0 && (
                              <span className="text-xs text-gray-500">({totalReactions})</span>
                            )}
                          </button>

                          {/* Reaction Menu */}
                          {showReactionMenu === post.id && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-2xl px-2 py-2 flex gap-1 border border-gray-200 animate-[slideUp_0.3s_ease-out]">
                              {reactionTypes.map((reaction) => (
                                <button
                                  key={reaction.type}
                                  onClick={() => handleReaction(post.id, reaction.type)}
                                  className={`p-2 rounded-full hover:scale-125 transition-all duration-300 ${reaction.color} hover:bg-gray-100`}
                                  title={reaction.label}
                                >
                                  <reaction.icon className="text-2xl" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-teal-50"
                        >
                          <FaCommentDots className="text-xl" />
                          <span className="text-sm font-medium">
                            {post.comments.length > 0 ? `Comment (${post.comments.length})` : 'Comment'}
                          </span>
                        </button>

                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-green-50">
                          <FaShare className="text-xl" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      commentsExpanded ? 'max-h-screen' : 'max-h-0'
                    }`}>
                      <div className="bg-gray-50">
                        {/* Existing Comments */}
                        {post.comments.length > 0 && (
                          <div className="px-4 py-3 space-y-3">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2">
                                <img
                                  src={comment.author.avatar}
                                  alt={comment.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm text-gray-800">
                                      {comment.author.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(comment.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment */}
                        <div className="px-4 py-3 flex gap-2 border-t border-gray-200">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) =>
                                setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                              }
                              onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              placeholder="Write a comment..."
                              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* My Network View */}
            {activeView === 'network' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">My Network</h2>
                  <div className="space-y-4">
                    {networkConnections.map((connection) => (
                      <div key={connection.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 border border-gray-100">
                        <img
                          src={connection.avatar}
                          alt={connection.name}
                          onClick={() => {
                            if (connection.userType === 'teacher') {
                              navigate(`/mentors/${connection.userId}`);
                            } else {
                              navigate('/browse');
                            }
                          }}
                          className="w-16 h-16 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-300"
                        />
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            if (connection.userType === 'teacher') {
                              navigate(`/mentors/${connection.userId}`);
                            } else {
                              navigate('/browse');
                            }
                          }}
                        >
                          <h4 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">{connection.name}</h4>
                          <p className="text-sm text-gray-600">{connection.headline}</p>
                          <p className="text-xs text-gray-500 mt-1">{connection.mutualConnections} mutual connections</p>
                        </div>
                        <button
                          onClick={() => navigate('/messages')}
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Message
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Trending Tags View */}
            {activeView === 'tags' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Topics</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {trendingTopics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl hover:from-blue-100 hover:to-teal-100 transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md"
                        onClick={() => setActiveView('feed')} // In a real app, this would filter posts by tag
                      >
                        <div className="text-2xl font-bold text-blue-600 mb-2">{topic.tag}</div>
                        <div className="text-gray-600 font-medium">{topic.count.toLocaleString()} posts</div>
                        <div className="mt-3 text-sm text-gray-500">Click to see posts</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Posts by Tag */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Posts This Week</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <img
                          src="https://ui-avatars.com/api/?name=Tech+News&size=50&background=3B82F6&color=fff"
                          alt="Post"
                          className="w-12 h-12 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">The Future of Web Development in 2025</h4>
                          <p className="text-sm text-gray-600 mb-2">Exploring the latest trends in JavaScript frameworks...</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>#JavaScript</span>
                            <span>•</span>
                            <span>2.3k views</span>
                            <span>•</span>
                            <span>245 reactions</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <img
                          src="https://ui-avatars.com/api/?name=Career+Tips&size=50&background=10B981&color=fff"
                          alt="Post"
                          className="w-12 h-12 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">How I Landed My Dream Developer Job</h4>
                          <p className="text-sm text-gray-600 mb-2">Tips and tricks for successful job hunting in tech...</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>#CareerAdvice</span>
                            <span>•</span>
                            <span>1.8k views</span>
                            <span>•</span>
                            <span>189 reactions</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <img
                          src="https://ui-avatars.com/api/?name=React+Pro&size=50&background=EC4899&color=fff"
                          alt="Post"
                          className="w-12 h-12 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">React 19: What's New and Exciting</h4>
                          <p className="text-sm text-gray-600 mb-2">Deep dive into the latest React features...</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>#ReactJS</span>
                            <span>•</span>
                            <span>3.1k views</span>
                            <span>•</span>
                            <span>312 reactions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* New Members Widget */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Welcome New Members!</h3>
                <div className="space-y-3">
                  {newMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-all duration-300">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        onClick={() => {
                          if (member.userType === 'teacher') {
                            navigate(`/mentors/${member.userId}`);
                          } else {
                            // For students, you could navigate to a student profile page if it exists
                            // For now, we'll just show a message or navigate to browse
                            navigate('/browse');
                          }
                        }}
                        className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-300"
                      />
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          if (member.userType === 'teacher') {
                            navigate(`/mentors/${member.userId}`);
                          } else {
                            navigate('/browse');
                          }
                        }}
                      >
                        <h4 className="font-semibold text-sm text-gray-800 truncate hover:text-blue-600 transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">{member.headline}</p>
                      </div>
                      <a
                        href="/messages"
                        className="text-blue-600 font-semibold text-xs hover:underline transition-all duration-300"
                      >
                        Say Hi
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Topics Widget */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Trending Topics</h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="block hover:bg-gray-50 rounded-lg p-2 transition-all duration-300"
                    >
                      <div className="font-semibold text-blue-600">{topic.tag}</div>
                      <div className="text-xs text-gray-500">{topic.count.toLocaleString()} posts</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Post Wizard Modal */}
      {showPostWizard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {showPostWizard === 'job_teacher' ? 'Looking for a Student' : 'Looking for a Teacher'}
              </h2>
              <button
                onClick={() => {
                  setShowPostWizard(null);
                  setWizardData({ title: '', content: '', skills: [], newSkill: '', budget: '', level: 'Beginner' });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {showPostWizard === 'job_teacher' ? 'Post Title' : 'Learning Goal'}
                </label>
                <input
                  type="text"
                  value={wizardData.title}
                  onChange={(e) => setWizardData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={showPostWizard === 'job_teacher' ? 'e.g., Need help with React project' : 'e.g., Want to learn Figma'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={wizardData.content}
                  onChange={(e) => setWizardData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  placeholder="Describe what you need..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {showPostWizard === 'job_student' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    My Current Level
                  </label>
                  <select
                    value={wizardData.level}
                    onChange={(e) => setWizardData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skills {showPostWizard === 'job_teacher' ? 'Needed' : 'I Need'}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {wizardData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => setWizardData(prev => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== idx)
                        }))}
                        className="hover:text-red-600 transition-colors"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wizardData.newSkill}
                    onChange={(e) => setWizardData(prev => ({ ...prev, newSkill: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && wizardData.newSkill.trim()) {
                        setWizardData(prev => ({
                          ...prev,
                          skills: [...prev.skills, prev.newSkill.trim()],
                          newSkill: ''
                        }));
                      }
                    }}
                    placeholder="Add a skill (press Enter)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (wizardData.newSkill.trim()) {
                        setWizardData(prev => ({
                          ...prev,
                          skills: [...prev.skills, prev.newSkill.trim()],
                          newSkill: ''
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {showPostWizard === 'job_teacher' ? 'Budget' : 'My Budget'}
                </label>
                <input
                  type="text"
                  value={wizardData.budget}
                  onChange={(e) => setWizardData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g., $50 flat fee or $25/hr"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPostWizard(null);
                    setWizardData({ title: '', content: '', skills: [], newSkill: '', budget: '', level: 'Beginner' });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateJobPost}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
