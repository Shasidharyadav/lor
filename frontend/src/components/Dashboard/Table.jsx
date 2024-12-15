import React from 'react';

const Table = ({ headers, data }) => {
  if (!data || !Array.isArray(data)) {
    return <p>No data available.</p>; 
  }

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.defaultProps = {
  headers: [],
  data: [], // Ensure data defaults to an empty array
};

export default Table;
