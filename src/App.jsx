import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGitHubData = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setProfile(null);
    setRepos([]);

    try {
      // Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) {
        throw new Error('User not found. Please check the username and try again.');
      }
      const userData = await userRes.json();
      setProfile(userData);

      // Fetch user repositories
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      const reposData = await reposRes.json();
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter repositories based on search input
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="app-container" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>GitHub Profile Analyzer</h1>
        <p>Search for any public GitHub profile and explore their work.</p>
        
        <form onSubmit={fetchGitHubData} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', width: '60%', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#2ea44f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </header>

      {loading && <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading profile...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '16px' }}>{error}</p>}

      {profile && (
        <div style={{ background: '#f6f8fa', border: '1px solid #e1e4e8', borderRadius: '8px', padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <img src={profile.avatar_url} alt={profile.name} style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px solid #e1e4e8' }} />
          <div>
            <h2>{profile.name || profile.login}</h2>
            <p style={{ color: '#586069', margin: '5px 0' }}>{profile.bio || 'No bio available.'}</p>
            <p><strong>Followers:</strong> {profile.followers} | <strong>Following:</strong> {profile.following}</p>
            <p><strong>Public Repositories:</strong> {profile.public_repos}</p>
            <a href={profile.html_url} target="_blank" rel="noreferrer" style={{ color: '#0366d6', textDecoration: 'none', fontWeight: 'bold' }}>
              View Profile on GitHub &rarr;
            </a>
          </div>
        </div>
      )}

      {profile && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Repositories ({filteredRepos.length})</h3>
            <input
              type="text"
              placeholder="Filter repositories..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ padding: '8px', fontSize: '14px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
            {filteredRepos.length === 0 ? (
              <p>No repositories found.</p>
            ) : (
              filteredRepos.map((repo) => (
                <div key={repo.id} style={{ border: '1px solid #e1e4e8', borderRadius: '6px', padding: '15px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>
                    <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ color: '#0366d6', textDecoration: 'none' }}>
                      {repo.name}
                    </a>
                  </h4>
                  <p style={{ fontSize: '14px', color: '#586069', margin: '0 0 10px 0' }}>{repo.description || 'No description provided.'}</p>
                  <div style={{ fontSize: '13px', display: 'flex', gap: '15px', color: '#586069' }}>
                    <span>⭐ Stars: {repo.stargazers_count}</span>
                    <span>💻 Lang: {repo.language || 'Not specified'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
  
}

export default App;