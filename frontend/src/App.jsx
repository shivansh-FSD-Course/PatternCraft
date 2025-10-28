import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">PatternCraft</h1>
        <div className="space-x-4">
          <button className="px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition">
            Login
          </button>
          <button className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Discover Hidden Patterns
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Upload your datasets and watch as AI uncovers mathematical patterns, 
          transforming them into stunning 3D visualizations
        </p>
        
        <div className="space-x-4">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-lg font-semibold hover:scale-105 transition transform">
            Get Started
          </button>
          <button className="px-8 py-4 border border-purple-400 rounded-lg text-lg font-semibold hover:bg-purple-900 transition">
            View Demo
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-purple-500/50">
            <div className="text-4xl mb-4">🔢</div>
            <h3 className="text-xl font-bold mb-2">Pattern Detection</h3>
            <p className="text-gray-400">AI algorithms find Fibonacci, golden ratios, and more</p>
          </div>
          
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-purple-500/50">
            <div className="text-4xl mb-4">🌌</div>
            <h3 className="text-xl font-bold mb-2">3D Visualizations</h3>
            <p className="text-gray-400">Transform data into spiral galaxies and particle systems</p>
          </div>
          
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-purple-500/50">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-400">Share discoveries and explore others' patterns</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App