import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import Papa from 'papaparse';

const LeaderboardTable = ({ fileName }) => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '#', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/data/${fileName}`);
        const text = await response.text();
        
        Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            // Find the header row (the one with "#" in first column)
            const headerRowIndex = results.data.findIndex(row => row[0] === '#');
            if (headerRowIndex >= 0) {
              const headers = results.data[headerRowIndex];
              const rows = results.data.slice(headerRowIndex + 1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                  obj[header] = row[index];
                });
                return obj;
              });
              setData(rows);
            }
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching file:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [fileName]);

  const sortData = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ARR?.toString().includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Convert to numbers for numerical columns
      if (['#', 'ARR', 'Race Days', 'Stage', 'Classics', 'GC', 'Total'].includes(sortConfig.key)) {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [data, sortConfig, searchTerm]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or ARR..."
          className="pl-10 p-2 w-full border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Name', 'ARR', 'Race Days', 'Stage', 'Classics', 'GC', 'Total'].map((header) => (
                <th
                  key={header}
                  className="p-3 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => sortData(header)}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">{row['#']}</td>
                <td className="p-3 font-medium">{row.Name}</td>
                <td className="p-3">{row.ARR}</td>
                <td className="p-3">{row['Race Days']}</td>
                <td className="p-3">{row.Stage}</td>
                <td className="p-3">{row.Classics}</td>
                <td className="p-3">{row.GC}</td>
                <td className="p-3 font-bold">{row.Total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredAndSortedData.length} of {data.length} entries
      </div>
    </div>
  );
};

// Main MultiLeaderboard component
const MultiLeaderboard = () => {
  const [activeTab, setActiveTab] = useState('overall');
  
  const leaderboards = [
    { id: 'overall', name: 'Overall Points', fileName: 'overall-points.csv' },
    { id: 'stage', name: 'Stage Points', fileName: 'stage-points.csv' },
    { id: 'gc', name: 'GC Points', fileName: 'gc-points.csv' },
    { id: 'classics', name: 'Classics Points', fileName: 'classics-points.csv' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <nav className="flex space-x-4 border-b">
          {leaderboards.map(board => (
            <button
              key={board.id}
              onClick={() => setActiveTab(board.id)}
              className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px transition-colors duration-200 ${
                activeTab === board.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {board.name}
            </button>
          ))}
        </nav>
      </div>

      {leaderboards.map(board => (
        <div key={board.id} className={activeTab === board.id ? 'block' : 'hidden'}>
          <LeaderboardTable fileName={board.fileName} />
        </div>
      ))}
    </div>
  );
};

export default MultiLeaderboard;
