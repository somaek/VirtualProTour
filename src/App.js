import React from 'react';
import MultiLeaderboard from './components/MultiLeaderboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Virtual Pro Tour Leaderboards
          </h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <MultiLeaderboard />
      </main>
    </div>
  );
}

export default App;
