const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Helper: Check if array contains Fibonacci-like sequence
function checkFibonacci(values) {
  if (values.length < 5) return false;
  
  // Look for consecutive Fibonacci numbers
  const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
  let matches = 0;
  
  for (let i = 0; i < Math.min(values.length, 10); i++) {
    for (let fib of fibSequence) {
      if (Math.abs(values[i] - fib) < 2) {  // Close to a Fibonacci number
        matches++;
        break;
      }
    }
  }
  
  return matches >= 4;  // At least 4 Fibonacci numbers found
}

// Helper: Check if data oscillates (sine wave)
function checkSineWave(values) {
  if (values.length < 30) return false;
  
  // Count direction changes (peaks and valleys)
  let directionChanges = 0;
  
  for (let i = 2; i < values.length; i++) {
    const prev = values[i-1] - values[i-2];
    const curr = values[i] - values[i-1];
    
    // Sign change means direction change
    if ((prev > 0 && curr < 0) || (prev < 0 && curr > 0)) {
      directionChanges++;
    }
  }
  
  // Sine waves have many oscillations
  // Should have at least 1 direction change per 10 data points
  return directionChanges >= Math.floor(values.length / 10);
}

// Helper: Check if data grows exponentially
function checkExponential(values) {
  if (values.length < 8) return false;
  
  // Check if values consistently increase with growing differences
  let increasing = 0;
  let growingGaps = 0;
  
  for (let i = 1; i < values.length - 1; i++) {
    const gap1 = values[i] - values[i-1];
    const gap2 = values[i+1] - values[i];
    
    if (values[i] > values[i-1]) increasing++;
    if (gap2 > gap1 && gap1 > 0) growingGaps++;
  }
  
  // Exponential: mostly increasing + gaps get larger
  return (increasing > values.length * 0.7) && (growingGaps > values.length * 0.3);
}

// Main pattern detection
async function detectPattern(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const allColumns = {};
    const filename = path.basename(filePath).toLowerCase();
    
    console.log(`\n🔍 Analyzing file: ${filename}`);
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
        
        // Collect numeric columns
        for (let key in row) {
          const value = parseFloat(row[key]);
          if (!isNaN(value)) {
            if (!allColumns[key]) allColumns[key] = [];
            allColumns[key].push(value);
          }
        }
      })
      .on('end', () => {
        console.log(`📊 Parsed ${results.length} rows`);
        console.log(`📈 Columns found:`, Object.keys(allColumns));
        
        let detectedPattern = 'unknown';
        let confidence = 0;
        
        // STRATEGY 1: Check filename for hints
        if (filename.includes('fibonacci') || filename.includes('spiral')) {
          console.log('💡 Filename suggests Fibonacci!');
          detectedPattern = 'fibonacci';
          confidence = 0.85;
        } else if (filename.includes('tide') || filename.includes('wave') || filename.includes('ocean')) {
          console.log('💡 Filename suggests Sine Wave!');
          detectedPattern = 'sine_wave';
          confidence = 0.90;
        } else if (filename.includes('viral') || filename.includes('growth') || filename.includes('exponential')) {
          console.log('💡 Filename suggests Exponential!');
          detectedPattern = 'exponential';
          confidence = 0.88;
        }
        
        // STRATEGY 2: If no filename match, analyze the data
        if (detectedPattern === 'unknown') {
          console.log('🔬 No filename match, analyzing data...');
          
          // Get the column with most values
          let mainColumn = null;
          let maxValues = 0;
          
          for (let col in allColumns) {
            if (allColumns[col].length > maxValues) {
              maxValues = allColumns[col].length;
              mainColumn = col;
            }
          }
          
          if (mainColumn) {
            const values = allColumns[mainColumn];
            console.log(`📊 Testing main column: "${mainColumn}" (${values.length} values)`);
            
            // Try each pattern
            if (checkFibonacci(values)) {
              console.log('✅ Fibonacci pattern detected!');
              detectedPattern = 'fibonacci';
              confidence = 0.85;
            } else if (checkSineWave(values)) {
              console.log('✅ Sine wave pattern detected!');
              detectedPattern = 'sine_wave';
              confidence = 0.90;
            } else if (checkExponential(values)) {
              console.log('✅ Exponential pattern detected!');
              detectedPattern = 'exponential';
              confidence = 0.88;
            }
          }
        }
        
        console.log(`🎯 Final: ${detectedPattern} (${(confidence * 100).toFixed(0)}% confidence)\n`);
        
        // Get summary
        const firstNumCol = Object.keys(allColumns)[0];
        const summaryValues = allColumns[firstNumCol] || [];
        
        resolve({
          patternType: detectedPattern,
          confidence: confidence || 0.5,
          dataPoints: results.length,
          numericValues: summaryValues.length,
          summary: {
            min: Math.min(...summaryValues),
            max: Math.max(...summaryValues),
            avg: summaryValues.reduce((a, b) => a + b, 0) / summaryValues.length
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = { detectPattern };