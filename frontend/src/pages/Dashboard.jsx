import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// Pattern List Component
function PatternList() {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/upload/patterns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatterns(data);
      }
    } catch (error) {
      console.error('Error fetching patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatternEmoji = (type) => {
    switch(type) {
      case 'fibonacci': return '🌀';
      case 'sine_wave': return '🌊';
      case 'exponential': return '📈';
      default: return '❓';
    }
  };

  const getPatternName = (type) => {
    switch(type) {
      case 'fibonacci': return 'Fibonacci Spiral';
      case 'sine_wave': return 'Sine Wave';
      case 'exponential': return 'Exponential Growth';
      default: return 'Unknown Pattern';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading patterns...</div>;
  }

  if (patterns.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-6xl mb-4">🔍</div>
        <p>No patterns discovered yet</p>
        <p className="text-sm mt-2">Upload your first dataset to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patterns.map((pattern) => (
        <div 
          key={pattern._id}
          className="bg-purple-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500 transition cursor-pointer"
        >
          <div className="text-5xl mb-3">{getPatternEmoji(pattern.patternType)}</div>
          <h4 className="text-xl font-bold mb-2">{getPatternName(pattern.patternType)}</h4>
          <p className="text-sm text-gray-400 mb-3">{pattern.originalName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-purple-300">
              Confidence: {(pattern.confidence * 100).toFixed(0)}%
            </p>
            <p className="text-gray-400">
              Data Points: {pattern.dataPoints}
            </p>
            <p className="text-gray-400">
              {new Date(pattern.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  const [user, setUser] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      navigate('/login')
      return
    }
    
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file)
        setUploadMessage('')
      } else {
        setUploadMessage('Please select a CSV file')
        setSelectedFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file first')
      return
    }

    setUploading(true)
    setUploadMessage('')

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/upload/csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // Show pattern detection results
        const patternInfo = data.pattern;
        setUploadMessage(
          `✅ Pattern Detected: ${patternInfo.type.toUpperCase()} (${patternInfo.confidence} confidence, ${patternInfo.dataPoints} data points)`
        );
        setSelectedFile(null);
        document.getElementById('fileInput').value = '';
        
        // Reload patterns after short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setUploadMessage(`❌ ${data.message}`)
      }
    } catch (error) {
      setUploadMessage('❌ Upload failed. Check if backend is running.')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    alert('Logged out successfully!')
    navigate('/')
  }

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center">
      <p>Loading...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-purple-500/30">
        <Link to="/dashboard">
          <h1 className="text-3xl font-bold">PatternCraft</h1>
        </Link>
        <div className="flex items-center space-x-6">
          <span className="text-gray-300">Welcome, {user.name}!</span>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-8">Your Dashboard</h2>
        
        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-purple-500/50 mb-8">
          <h3 className="text-2xl font-bold mb-4">Upload Dataset</h3>
          <p className="text-gray-400 mb-6">Upload a CSV file to discover mathematical patterns</p>
          
          <div className="border-2 border-dashed border-purple-500/50 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl mb-4">Select your CSV file</p>
            
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <label htmlFor="fileInput">
              <span className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition cursor-pointer inline-block">
                Browse Files
              </span>
            </label>
            
            {selectedFile && (
              <div className="mt-4 p-4 bg-purple-900/30 rounded-lg">
                <p className="text-green-400">✓ Selected: {selectedFile.name}</p>
                <p className="text-sm text-gray-400">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
            
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload & Analyze'}
              </button>
            )}
            
            {uploadMessage && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="whitespace-pre-line">{uploadMessage}</p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-4">Max file size: 10MB</p>
          </div>
        </div>

        {/* Pattern History Section */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-purple-500/50">
          <h3 className="text-2xl font-bold mb-4">Your Pattern Discoveries</h3>
          <PatternList />
        </div>
      </div>
    </div>
  )
}

export default Dashboard